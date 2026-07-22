import DeleteModal from '@/components/inertia/delete-modal';
import Switch from '@/components/switch';
import Tabs from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { buildNavbarTree, recalculateFlatSorts, type NavbarTreeNode } from '@/lib/navbar-tree';
import { router, useForm } from '@inertiajs/react';
import { ArrowUpDown, Edit, ExternalLink, GripVertical, Plus, Settings, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface NavbarItemForm {
   type: 'url' | 'category' | 'action';
   slug: string;
   subtitle: string;
   title: string;
   value: string;
   active: boolean;
   parent_id: number | null;
   course_category_id: number | null;
   items: { title: string; url: string }[];
   sort: number;
   [key: string]: any;
}

interface Props {
   navbar: Navbar;
   courseCategories: CourseCategory[];
}

const getRootMenuCount = (items: NavbarItem[]) => items.filter((item) => item.type !== 'action' && !item.parent_id).length;

const moveTreeItem = (items: NavbarItem[], draggedId: string | number, targetId: string | number, mode: 'before' | 'after' | 'child') => {
   const reordered = [...items];
   const draggedIndex = reordered.findIndex((item) => String(item.id) === String(draggedId));
   const targetIndex = reordered.findIndex((item) => String(item.id) === String(targetId));
   const targetItem = reordered[targetIndex];

   if (draggedIndex < 0 || targetIndex < 0 || draggedIndex === targetIndex) {
      return items;
   }

   const [draggedItem] = reordered.splice(draggedIndex, 1);
   const nextTargetIndex = reordered.findIndex((item) => String(item.id) === String(targetId));

   reordered.splice(nextTargetIndex >= 0 ? nextTargetIndex + (mode === 'before' ? 0 : 1) : reordered.length, 0, {
      ...draggedItem,
      parent_id: mode === 'child' ? Number(targetId) : targetItem?.parent_id ?? null,
   });

   return recalculateFlatSorts(reordered);
};

const NavbarEditor = ({ navbar, courseCategories }: Props) => {
   const [activeType, setActiveType] = useState<'menu' | 'action'>('menu');
   const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [menuItems, setMenuItems] = useState<NavbarItem[]>([]);
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
      course_category_id: null,
      sort: 0,
   });

   const sortedNavbarItems = useMemo(() => [...navbar.navbar_items].sort((a, b) => Number(a.sort) - Number(b.sort) || Number(a.id) - Number(b.id)), [navbar.navbar_items]);
   const actionItems = useMemo(() => sortedNavbarItems.filter((item) => item.type === 'action'), [sortedNavbarItems]);
   const activeMenuItems = useMemo(() => menuItems.filter((item) => item.type !== 'action'), [menuItems]);
   const menuTree = useMemo(() => buildNavbarTree(activeMenuItems), [activeMenuItems]);

   useEffect(() => {
      setMenuItems(sortedNavbarItems.filter((item) => item.type !== 'action'));
   }, [sortedNavbarItems]);

   const persistMenuOrder = (items: NavbarItem[]) => {
      const sortedData = recalculateFlatSorts(items).map((item) => ({
         id: Number(item.id),
         sort: item.sort,
         parent_id: item.parent_id === null ? null : Number(item.parent_id),
      }));

      router.post(
         route('settings.navbar.items.reorder'),
         { sortedData },
         {
            preserveScroll: true,
            onSuccess: () => {
               router.reload({ only: ['navbar'] });
            },
         },
      );
   };

   const openCreateForm = (type: 'url' | 'category' | 'action') => {
      const defaultCategory = type === 'category' ? courseCategories[0] : null;

      setEditingItem(null);
      setData({
         type,
         slug: type === 'category' && defaultCategory ? `category-${defaultCategory.slug}` : '',
         subtitle: '',
         title: type === 'category' && defaultCategory ? defaultCategory.title : '',
         value: '',
         items: [],
         active: true,
         parent_id: null,
         course_category_id: defaultCategory ? Number(defaultCategory.id) : null,
         sort: type === 'action' ? actionItems.length + 1 : getRootMenuCount(menuItems) + 1,
      });
      setIsFormOpen(true);
   };

   const openEditForm = (item: NavbarItem) => {
      setEditingItem(item);
      setData({
         type: item.type as NavbarItemForm['type'],
         slug: item.slug,
         subtitle: item.subtitle || '',
         title: item.title,
         value: item.value || '',
         items: Array.isArray(item.items) ? item.items.map((subItem: any) => ({ title: subItem.title || '', url: subItem.url || '' })) : [],
         active: item.active,
         parent_id: item.parent_id ?? null,
         course_category_id: item.course_category_id ?? null,
         sort: item.sort,
      });
      setIsFormOpen(true);
   };

   const handleCategorySelect = (courseCategoryId: string) => {
      const selectedCategory = courseCategories.find((category) => String(category.id) === courseCategoryId);

      setData((prev) => ({
         ...prev,
         course_category_id: selectedCategory ? Number(selectedCategory.id) : null,
         title: selectedCategory ? selectedCategory.title : prev.title,
         slug: selectedCategory ? `category-${selectedCategory.slug}` : prev.slug,
      }));
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

      const nextItems = moveTreeItem(menuItems, draggedId, targetId, mode);
      setMenuItems(nextItems);
      setDraggedId(null);
      setDropState(null);
      persistMenuOrder(nextItems);
   };

   const renderMenuNode = (node: NavbarTreeNode<NavbarItem>, depth = 0) => {
      const selectedCategory = node.item.course_category_id ? courseCategories.find((category) => category.id === node.item.course_category_id) : null;
      const isDragged = draggedId === node.item.id;
      const hasStaticChildren = node.children.length > 0;

      return (
         <div key={node.item.id} className="space-y-2">
            <div
               draggable
               onDragStart={() => handleDragStart(node.item.id)}
               onDragEnd={handleDragEnd}
               onDragOver={(event) => {
                  event.preventDefault();

                  if (draggedId === node.item.id) {
                     return;
                  }

                  const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
                  const xOffset = event.clientX - rect.left;
                  const childThreshold = 78;
                  const mode = depth === 0 && xOffset > childThreshold ? 'child' : event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';

                  setDropState({ id: node.item.id, mode });
               }}
               onDrop={(event) => {
                  event.preventDefault();
                  handleDropZone(node.item.id, dropState?.id === node.item.id ? dropState.mode : 'after');
               }}
               className={cn(
                  'group flex items-start gap-3 rounded-2xl border border-transparent bg-muted/70 p-3 transition-all',
                  depth > 0 && 'ml-8 border-l-2 border-dashed border-primary/20 bg-background/80',
                  isDragged && 'opacity-40',
                  dropState?.id === node.item.id && 'border-primary/40 bg-primary/5',
               )}
            >
               <button
                  type="button"
                  className="mt-0.5 cursor-grab rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-foreground active:cursor-grabbing"
               >
                  <GripVertical className="h-4 w-4" />
               </button>

               <div className="flex-1">
                  {node.item.subtitle ? <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-500">{node.item.subtitle}</div> : null}

                  <div className="flex items-center gap-2">
                     {node.item.type === 'action' ? <Settings className="h-4 w-4 text-muted-foreground" /> : <ExternalLink className="h-4 w-4 text-muted-foreground" />}
                     <div className="font-medium text-foreground">{node.item.title}</div>
                     {node.item.type === 'category' ? (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                           Category
                        </span>
                     ) : null}
                     {hasStaticChildren ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                           Dropdown
                        </span>
                     ) : null}
                  </div>

                  {node.item.type === 'category' ? (
                     <div className="mt-1 text-sm text-muted-foreground">
                        {selectedCategory ? `${selectedCategory.courses_count ?? 0} courses from ${selectedCategory.title}` : 'Dynamic course list'}
                     </div>
                  ) : node.item.value ? (
                     <div className="mt-1 text-sm text-muted-foreground">{node.item.value}</div>
                  ) : null}
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

            {node.children.length > 0 && <div className="space-y-2">{node.children.map((child) => renderMenuNode(child, depth + 1))}</div>}
         </div>
      );
   };

   return (
      <div className="p-4 sm:p-6">
         <Tabs value={activeType} onValueChange={(value) => setActiveType(value as 'menu' | 'action')}>
            <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-center">
               <TabsList className="grid h-auto grid-cols-2 sm:h-10 sm:grid-cols-2">
                  <TabsTrigger value="menu" className="flex h-8 cursor-pointer items-center gap-2">
                     <ExternalLink className="h-4 w-4" />
                     Menu Items ({menuItems.length})
                  </TabsTrigger>
                  <TabsTrigger value="action" className="flex h-8 cursor-pointer items-center gap-2">
                     <Settings className="h-4 w-4" />
                     Actions ({actionItems.length})
                  </TabsTrigger>
               </TabsList>

               <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-full border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
                     Drag items to reorder. Slide an item to the right of another root item to nest it.
                  </div>

                  <Button variant="outline" className="flex items-center gap-2" onClick={() => openCreateForm('url')}>
                     <Plus className="h-4 w-4" />
                     Add URL
                  </Button>

                  <Button variant="outline" className="flex items-center gap-2" onClick={() => openCreateForm('category')} disabled={courseCategories.length === 0}>
                     <Plus className="h-4 w-4" />
                     Add Category
                  </Button>
               </div>
            </div>

            <TabsContent value="menu" className="space-y-4">
               {menuTree.length > 0 ? (
                  <div className="space-y-3">{menuTree.map((node) => renderMenuNode(node))}</div>
               ) : (
                  <div className="py-8 text-center text-gray-500">No menu items found. Use the buttons above to add URL items or course categories.</div>
               )}
            </TabsContent>

            <TabsContent value="action" className="space-y-4">
               {actionItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     {actionItems.map((item) => (
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
                     {editingItem ? 'Edit' : 'Create'} {data.type === 'category' ? 'Category' : data.type.charAt(0).toUpperCase() + data.type.slice(1)} Item
                  </DialogTitle>
                  <DialogDescription>
                     {editingItem ? 'Update the details of this navbar item.' : 'Add a new navbar item to your navigation.'}
                  </DialogDescription>
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

                  {data.type !== 'action' && (
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

                  {data.type === 'category' && (
                     <div>
                        <Label htmlFor="course_category_id">Course Category</Label>
                        <Select
                           value={data.course_category_id ? String(data.course_category_id) : ''}
                           onValueChange={handleCategorySelect}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                           </SelectTrigger>
                           <SelectContent>
                              {courseCategories.map((category) => (
                                 <SelectItem key={category.id} value={String(category.id)}>
                                    {category.title}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
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
