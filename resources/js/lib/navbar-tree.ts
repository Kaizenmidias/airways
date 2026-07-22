export interface NavbarTreeNode<T extends NavbarItem = NavbarItem> {
   item: T;
   children: NavbarTreeNode<T>[];
}

const groupKey = (parentId: string | number | null | undefined) => (parentId === null || parentId === undefined ? 'root' : `parent-${String(parentId)}`);

export const buildNavbarTree = <T extends NavbarItem>(items: T[]): NavbarTreeNode<T>[] => {
   const groups = new Map<string, T[]>();
   const itemIds = new Set(items.map((item) => String(item.id)));

   items.forEach((item) => {
      const key = groupKey(item.parent_id);
      const group = groups.get(key) ?? [];
      group.push(item);
      groups.set(key, group);
   });

   const sortGroup = (group: T[] = []) => [...group].sort((a, b) => Number(a.sort) - Number(b.sort) || Number(a.id) - Number(b.id));

   const buildLevel = (parentId: string | number | null): NavbarTreeNode<T>[] => {
      return sortGroup(groups.get(groupKey(parentId)) ?? []).map((item) => ({
         item,
         children: buildLevel(item.id),
      }));
   };

   const roots = buildLevel(null);
   const orphanRoots = sortGroup(items.filter((item) => item.parent_id !== null && !itemIds.has(String(item.parent_id)))).map((item) => ({
      item,
      children: buildLevel(item.id),
   }));

   return [...roots, ...orphanRoots];
};

export const flattenNavbarTree = <T extends NavbarItem>(nodes: NavbarTreeNode<T>[]): Array<T & { parent_id: number | null; sort: number }> => {
   const flattened: Array<T & { parent_id: number | null; sort: number }> = [];
   const visit = (currentNodes: NavbarTreeNode<T>[], parentId: string | number | null) => {
      currentNodes.forEach((node, index) => {
         flattened.push({
            ...node.item,
            parent_id: parentId,
            sort: index + 1,
         });

         if (node.children.length > 0) {
            visit(node.children, node.item.id);
         }
      });
   };

   visit(nodes, null);

   return flattened;
};

export const recalculateFlatSorts = (items: NavbarItem[]) => {
   const counters = new Map<string, number>();

   return items.map((item) => {
      const key = groupKey(item.parent_id);
      const nextSort = (counters.get(key) ?? 0) + 1;
      counters.set(key, nextSort);

      return {
         ...item,
         sort: nextSort,
      };
   });
};
