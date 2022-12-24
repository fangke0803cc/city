const routes = [
  {
    path: '',
    name: 'apartmentArea',
    component: () => import('../views/ApartmentArea.vue')

  },
  {
    path: 'buildingdetail',
    name: 'buildingdetail',
    component: () => import('../views/BuildingDetail.vue')
  }
]
export default routes
