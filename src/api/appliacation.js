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
const BASE_URL_V3 = '/sourceTree'
// /v1/tenantIds/findAllTree?tenantId=230719420257931264

const SPRING_BASE_URL_V1 = '/pulsar-manager/api'
// 列表初始化(查询)
export function getList(query) {
    return request({
      url: BASE_URL_V2 + `/pmq/app/manage/select`,
      method: 'get',
      params: query
    })
  }
  // 新增
export function AddApp(data) {
  return request({
    url: BASE_URL_V2 + `/pmq/app/manage/insertApp`,
    method: 'post',
    data
  })
}
  // 删除
export function Deletefn(data) {
    return request({
      url: BASE_URL_V2 + `/pmq/app/manage/deleteApp`,
      method: 'post',
      params: data
    })
  }
  // 修改
export function updateApp(data) {
  console.log(data)
  return request({
    url: BASE_URL_V2 + `/pmq/app/manage/updateApp`,
    method: 'post',
    data
  })
}
// 赋予-应用程序权限
export function permission(data) {
  return request({
    url: BASE_URL_V2 + `/pmq/topic/manage/grant/permission`,
    method: 'post',
    data
  })
}
// 应用程序下拉
export function getAppSelectList(cluster,data) {
  return request({
    url: BASE_URL_V2 + `/pmq/app/manage/select/all`,
    method: 'get'
  })
}
// 应用程序下拉
export function GrantList(data) {
  return request({
    url: BASE_URL_V2 + `/pmq/app/manage/select/grant`,
    method: 'get',
    params: data
  })
}
// 下拉树
export function SourceTrees(data) {
  return request({
    url: BASE_URL_V3 + `/v1/tenantIds/findAllTree`,
    method: 'get',
    params: data
  })
}

