/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import request from '@/utils/request'

const BASE_URL_V2 = '/application'

const SPRING_BASE_URL_V1 = '/pulsar-manager/api/v1'
// 列表初始化(查询)
export function getList(query) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/open/topic/list`,
      method: 'get',
      params: query
    })
  }
  // 新增（主题列表）
export function AddApp(data) {
  return request({
    url: BASE_URL_V2 + `/pmq/topic/manage/insert`,
    method: 'post',
    data
  })
}
  // 新增(开放主题)
  export function InsertApp(data) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/open/topic/insert`,
      method: 'post',
      data
    })
  }
  // 删除
export function Deletefn(data) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/open/topic/delete`,
      method: 'post',
      data
    })
  }
    // 删除(主题管理)
    export function Deletefn2(data) {
      return request({
        url: BASE_URL_V2 + `/pmq/topic/manage/delete`,
        method: 'post',
        data
      })
    }

  // 修改
export function updateApp(data) {
  console.log(data)
  return request({
    url: BASE_URL_V2 + `/pmq/topic/manage/update`,
    method: 'post',
    data
  })
}
// 租户命名空间列表
export function tenantList(query) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/list/tenants/namespace`,
      method: 'get',
    //   params: query
    })
  }
// 开放主题列表下拉
  export function topicList(query) {
    return request({
      url: BASE_URL_V2 + `/pmq/topic/manage/list/tenants/namespace/topic`,
      method: 'get',
    //   params: query
    })
  }


