import axios from "../services/api";
import { ref } from "vue";

const menuItems = ref([]);

// buat format menu to side-nav
const formatMenuData = (data, userRoles) => {
  return data
    .filter(item => userRoles.includes(item.role))  // filter item dari rolenya
    .map(item => ({
      id: item.id,
      label: item.label,
      isTitle: item.isTitle,
      icon: item.icon,
      role: item.role,
      subItems: item.sub_menus.map(sub => ({
        id: sub.id,
        label: sub.label,
        link: sub.link,
        parentId: item.id,
      })),
    }));
};

// gabung item sesuai roles (antisipasi role lebih dari 1)
const mergeMenuItems = (items) => {
  const mergedItems = new Map();
  
  items.forEach(item => {
    if (!mergedItems.has(item.label)) {
      mergedItems.set(item.label, { ...item, subItems: item.subItems ? [...item.subItems] : [] });
    } else {
      const existingItem = mergedItems.get(item.label);
      if (item.subItems) {
        item.subItems.forEach(subItem => {
          if (!existingItem.subItems.some(existingSub => existingSub.label === subItem.label)) {
            existingItem.subItems.push(subItem);
          }
        });
      }
    }
  });

  return Array.from(mergedItems.values());
};

// Mengambil data dari API dan memformatnya
export const fetchMenuItems = async() => {
  try {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const userRoles = user.roles ? user.roles.map(role => role.role) : [];
    const response = await axios.get("/api/admin/menus");
    const formattedItems = formatMenuData(response.data.data, userRoles);
    menuItems.value = mergeMenuItems(formattedItems);
    console.log(menuItems.value);
  } catch (error) {
    console.error("Error fetching menu items:", error);
  }
};

export { menuItems }
