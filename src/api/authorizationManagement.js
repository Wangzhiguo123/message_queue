import request from '@/utils/request'

const BASE_URL_V2 = '/application'
// const SPRING_BASE_URL_V1 = '/pulsar-manager/api/v1'
// 列表初始化(查询)
export function getList(query) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/list`,
      method: 'get',
      params: query
    })
  }
  // 新增
export function AddApp(cluster,data) {
  return request({
    url: BASE_URL_V2 + `/pmq/topic/manage/insertApp`,
    method: 'post',
    data:data
  })
}
  // 删除
export function Deletefn(data) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/delete`,
      method: 'post',
      params: data
    })
  }
  // 修改
export function updateApp(cluster,data) {
  return request({
    url: BASE_URL_V2 + `/pmq/topic/manage/updateApp`,
    method: 'post',
    data
  })
}

export function deleteRacksByBookie(bookie) {
  return request({
    url: BASE_URL_V2 + `/bookies/racks-info/${bookie}`,
    method: 'delete'
  })
}
// 租户命名空间列表
export function TopicList(query) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/list/tenants/namespace`,
      method: 'get',
    //   params: query
    })
  }
  // 查询授予权限情况
  export function GrantList(query) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/select/grant`,
      method: 'get',
      params: query
    })
  }
  export function permission(data) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/grant/permission`,
      method: 'post',
      data
    })
  }


  
// 获取命名空间主题下拉
export function getNameSpaceSelectList(cluster,data) {
  return request({
    url: BASE_URL_V2 + `/pmq/topic/manage/list/tenants/namespace/topic`,
    method: 'get',
    data
  })
}