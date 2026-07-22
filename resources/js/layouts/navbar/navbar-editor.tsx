import DeleteModal from '@/components/inertia/delete-modal';
import Switch from '@/components/switch';
import Tabs from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { buildNavbarTree, recalculateFlatSorts } from '@/lib/navbar-tree';
import { router, useForm } from '@inertiajs/react';
import { ArrowUpDown, Edit, ExternalLink, GripVertical, Plus, Settings, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface NavbarItemForm {
   type: string;
   slug: string;
   subtitle: string;
   title: string;
   value: string;
   active: boolean;
   parent_id: number | null;
   items: { title: string; url: string }[];
   sort: number;
   [key: string]: any;
}

interface NavbarTreeNode {
   item: NavbarItem;
   children: NavbarTreeNode[];
}

const getRootLinkCount = (items: NavbarItem[]) => items.filter((item) => item.type !== 'action' && !item.parent_id).length;

const moveTreeItem = (items: NavbarItem[], draggedId: number | string, targetId: number | string, mode: 'before' | 'after' | 'child') => {
   const reordered = [...items];
   const draggedIndex = reordered.findIndex((item) => String(item.id) === String(draggedId));
   const targetIndex = reordered.findIndex((item) => String(item.id) === String(targetId));
   const targetItem = reordered[targetIndex];

   if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) {
      return items;
   }

   const [draggedItem] = reordered.splice(draggedIndex, 1);
   const nextTargetIndex = reordered.findIndex((item) => String(item.id) === String(targetId));

   const updatedDragged = {
      ...draggedItem,
      parent_id: mode === 'child' ? Number(targetId) : targetItem?.parent_id ?? null,
   };

   const insertionIndex = mode === 'before' ? nextTargetIndex : nextTargetIndex + 1;
   reordered.splice(insertionIndex, 0, updatedDragged);

   return recalculateFlatSorts(reordered);
};

const NavbarEditor = ({ navbar }: { navbar: Navbar }) => {
   const navbarItems = useMemo(() => [...navbar.navbar_items].sort((a, b) => Number(a.sort) - Number(b.sort) || Number(a.id) - Number(b.id)), [navbar.navbar_items]);
   const linkItems = useMemo(() => navbarItems.filter((item) => item.type !== 'action'), [navbarItems]);
   const linkTree = useMemo(() => buildNavbarTree(linkItems), [linkItems]);
   const [activeType, setActiveType] = useState<string>('url');
   const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [isReorderOpen, setIsReorderOpen] = useState(false);
   const [reorderItems, setReorderItems] = useState<NavbarItem[]>(linkItems);
   const [draggedId, setDraggedId] = useState<string | number | null>(null);
   const [dropState, setDropState] = useState<{ id: string | number; mode: 'before' | 'after' | 'child' } | null>(null);

   const { data, setData, post, put, processing } = useForm<NavbarItemForm>({
      type: 'url',
      slug: '',
      subtitle: '',
      title: '',
      value: '',
      items: [],
      active: true,
      parent_id: null,
      sort: 0,
   });

   useEffect(() => {
      if (!isReorderOpen) {
         setReorderItems(linkItems);
      }
   }, [isReorderOpen, linkItems]);

   const openCreateForm = (type: string) => {
      setEditingItem(null);
      setData({
         type,
         slug: '',
         subtitle: '',
         title: '',
         value: '',
         items: [],
         active: true,
         parent_id: null,
         sort: type === 'url' ? getRootLinkCount(linkItems) + 1 : navbarItems.filter((item) => item.type === 'action').length + 1,
      });
      setIsFormOpen(true);
   };

   const openEditForm = (item: NavbarItem) => {
      setEditingItem(item);
      setData({
         type: item.type,
         slug: item.slug,
         subtitle: item.subtitle || '',
         title: item.title,
         value: item.value || '',
         active: item.active,
         parent_id: item.parent_id ?? null,
         items: Array.isArray(item.items) ? item.items.map((subItem: any) => ({ title: subItem.title || '', url: subItem.url || '' })) : [],
         sort: item.sort,
      });
      setIsFormOpen(true);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (editingItem) {
         put(`/dashboard/settings/navbar-items/${editingItem.id}`, {
            onSuccess: () => {
               setIsFormOpen(false);
               router.reload({ only: ['navbar'] });
            },
         });
      } else {
         post(`/dashboard/settings/navbar/${navbar.id}/items`, {
            onSuccess: () => {
               setIsFormOpen(false);
               router.reload({ only: ['navbar'] });
            },
         });
      }
   };

   const handleReorderSave = () => {
      const sortedData = recalculateFlatSorts(reorderItems).map((item) => ({
         id: Number(item.id),
         sort: item.sort,
         parent_id: item.parent_id === null ? null : Number(item.parent_id),
      }));

      router.post(
         route('settings.navbar.items.reorder'),
         {
            sortedData,
         },
         {
            preserveScroll: true,
            onSuccess: () => {
               setIsReorderOpen(false);
               router.reload({ only: ['navbar'] });
            },
         },
      );
   };

   const handleDragStart = (itemId: string | number) => {
      setDraggedId(itemId);
   };

   const handleDragEnd = () => {
      setDraggedId(null);
      setDropState(null);
   };

   const handleDropZone = (targetId: string | number, mode: 'before' | 'after' | 'child') => {
      if (draggedId === null) {
         return;
      }

      setReorderItems((current) => moveTreeItem(current, draggedId, targetId, mode));
      setDraggedId(null);
      setDropState(null);
   };

   const renderTreeNode = (node: NavbarTreeNode, depth = 0, draggable = false) => {
      const hasChildren = node.children.length > 0;
      const isDragged = draggedId === node.item.id;

      return (
         <div key={node.item.id} className="space-y-2">
            <div
               draggable={draggable}
               onDragStart={draggable ? () => handleDragStart(node.item.id) : undefined}
               onDragEnd={draggable ? handleDragEnd : undefined}
               onDragOver={
                  draggable
                     ? (event) => {
                          event.preventDefault();

                          if (draggedId === node.item.id) {
                             return;
                          }

                          const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
                          const xOffset = event.clientX - rect.left;
                          const childThreshold = 78;
                          const mode = depth === 0 && xOffset > childThreshold ? 'child' : event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';

                          setDropState({ id: node.item.id, mode });
                       }
                     : undefined
               }
               onDrop={
                  draggable
                     ? (event) => {
                          event.preventDefault();
                          handleDropZone(node.item.id, dropState?.id === node.item.id ? dropState.mode : 'after');
                       }
                     : undefined
               }
               className={cn(
                  'group flex items-start gap-3 rounded-2xl border border-transparent bg-muted/70 p-3 transition-all',
                  depth > 0 && 'ml-8 border-l-2 border-dashed border-primary/20 bg-background/80',
                  draggable && isDragged && 'opacity-40',
                  draggable && dropState?.id === node.item.id && 'border-primary/40 bg-primary/5',
               )}
            >
               {draggable ? (
                  <button
                     type="button"
                     className="mt-0.5 cursor-grab rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground active:cursor-grabbing"
                  >
                     <GripVertical className="h-4 w-4" />
                  </button>
               ) : null}

               <div className="flex-1">
                  {node.item.subtitle ? <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-500">{node.item.subtitle}</div> : null}
                  <div className="flex items-center gap-2">
                     {node.item.type === 'action' ? <Settings className="h-4 w-4 text-muted-foreground" /> : <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                     <div className="font-medium text-foreground">{node.item.title}</div>
                     {hasChildren && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                           Dropdown
                        </span>
                     )}
                  </div>
                  {node.item.value ? <div className="mt-1 text-sm text-muted-foreground">{node.item.value}</div> : null}
               </div>

               <div className="flex gap-2">
                  <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEditForm(node.item)}>
                     <Edit className="h-3 w-3" />
                  </Button>
                  <DeleteModal
                     routePath={route('settings.navbar.items.destroy', node.item.id)}
                     actionComponent={
                        <Button variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8">
                           <Trash2 className="text-destructive h-3 w-3" />
                        </Button>
                     }
                  />
               </div>
            </div>

            {node.children.length > 0 && <div className="space-y-2">{node.children.map((child) => renderTreeNode(child, depth + 1, draggable))}</div>}
         </div>
      );
   };

   return (
      <div className="p-4 sm:p-6">
         <Tabs value={activeType} onValueChange={setActiveType}>
            <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-center">
               <TabsList className="grid h-auto grid-cols-2 sm:h-10 sm:grid-cols-2">
                  <TabsTrigger value="url" className="flex h-8 cursor-pointer items-center gap-2">
                     <ExternalLink className="h-4 w-4" />
                     URL Items ({linkItems.length})
                  </TabsTrigger>
                  <TabsTrigger value="action" className="flex h-8 cursor-pointer items-center gap-2">
                     <Settings className="h-4 w-4" />
                     Actions ({navbarItems.filter((item) => item.type === 'action').length})
                  </TabsTrigger>
               </TabsList>

               <div className="flex items-center gap-2">
                  <Dialog open={isReorderOpen} onOpenChange={setIsReorderOpen}>
                     <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsReorderOpen(true)}>
                        <ArrowUpDown className="h-4 w-4" />
                        Reorder
                     </Button>
                     <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
                        <div className="border-b px-6 py-5">
                           <DialogHeader>
                              <DialogTitle>Reorder navbar items</DialogTitle>
                              <DialogDescription>Drag a link below and to the right of another link to turn it into a dropdown child.</DialogDescription>
                           </DialogHeader>
                        </div>

                        <div className="px-6 py-5">
                           <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                              <span>Drag rows to reorder. Drop to the right of a root item to create a dropdown.</span>
                              <Button type="button" onClick={handleReorderSave} disabled={!reorderItems.length}>
                                 Save order
                              </Button>
                           </div>

                           <div className="rounded-2xl border bg-background p-3">
                              <ScrollArea className="max-h-[60vh] pr-3">
                                 <div className="space-y-2">
                                    {buildNavbarTree(reorderItems).map((node) => renderTreeNode(node, 0, true))}
                                 </div>
                              </ScrollArea>
                           </div>
                        </div>
                     </DialogContent>
                  </Dialog>

                  {activeType === 'url' && (
                     <Button onClick={() => openCreateForm('url')} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add URL
                     </Button>
                  )}
               </div>
            </div>

            <TabsContent value="url" className="space-y-4">
               {linkTree.length > 0 ? (
                  <div className="space-y-3">
                     {linkTree.map((node) => renderTreeNode(node))}
                  </div>
               ) : (
                  <div className="py-8 text-center text-gray-500">No URL items found. Click "Add URL" to create one.</div>
               )}
            </TabsContent>

            <TabsContent value="action" className="space-y-4">
               {navbarItems.filter((item) => item.type === 'action').length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     {navbarItems
                        .filter((item) => item.type === 'action')
                        .map((item) => (
                           <div key={item.id} className="bg-muted flex items-center justify-between gap-3 rounded-2xl border p-3">
                              <div className="flex items-center gap-3">
                                 <Settings className="h-4 w-4" />

                                 <p className="text-sm font-medium">{item.title}</p>
                              </div>

                              <div className="flex items-center space-x-2">
                                 <Label htmlFor={`action-${item.id}`}>Active</Label>
                                 <Switch
                                    id={`action-${item.id}`}
                                    checked={item.active}
                                    onCheckedChange={(checked) => {
                                       router.put(`/dashboard/settings/navbar-items/${item.id}`, {
                                          ...(item as any),
                                          active: checked,
                                       });
                                    }}
                                 />
                              </div>
                           </div>
                        ))}
                  </div>
               ) : (
                  <div className="py-8 text-center text-gray-500">No action items found.</div>
               )}
            </TabsContent>
         </Tabs>

         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <DialogTitle>
                     {editingItem ? 'Edit' : 'Create'} {data.type.charAt(0).toUpperCase() + data.type.slice(1)} Item
                  </DialogTitle>
                  <DialogDescription>{editingItem ? 'Update the details of this navbar item.' : 'Add a new navbar item to your navigation.'}</DialogDescription>
               </DialogHeader>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Label>Status</Label>
                     <Select value={data.active ? 'Active' : 'Deactive'} onValueChange={(value) => setData((prev) => ({ ...prev, active: value === 'Active' }))}>
                        <SelectTrigger>
                           <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="Active">Active</SelectItem>
                           <SelectItem value="Deactive">Deactive</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div>
                     <Label htmlFor="title">Title</Label>
                     <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter title"
                        required
                     />
                  </div>

                  {data.type === 'url' && (
                     <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                           id="subtitle"
                           value={data.subtitle}
                           onChange={(e) => setData((prev) => ({ ...prev, subtitle: e.target.value }))}
                           placeholder="Enter a smaller label shown above the title"
                        />
                     </div>
                  )}

                  <div>
                     <Label htmlFor="slug">Slug</Label>
                     <Input
                        id="slug"
                        value={data.slug}
                        onChange={(e) => setData((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="Enter unique slug"
                        required
                     />
                  </div>

                  {data.type === 'url' && (
                     <div>
                        <Label htmlFor="value">URL</Label>
                        <Input
                           id="value"
                           value={data.value}
                           onChange={(e) => setData((prev) => ({ ...prev, value: e.target.value }))}
                           placeholder="Enter URL (e.g., /courses, https://example.com)"
                           required
                        />
                     </div>
                  )}

                  {data.type === 'action' && (
                     <div>
                        <Label htmlFor="action-type">Action Type</Label>
                        <Select value={data.slug} onValueChange={(value) => setData((prev) => ({ ...prev, slug: value }))}>
                           <SelectTrigger>
                              <SelectValue placeholder="Select action type" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="theme">Theme Toggle</SelectItem>
                              <SelectItem value="search">Search</SelectItem>
                              <SelectItem value="notification">Notifications</SelectItem>
                              <SelectItem value="profile">User Profile</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  )}

                  <DialogFooter>
                     <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                        Cancel
                     </Button>
                     <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default NavbarEditor;
