/*
 * @Description: 工具类
 * @Date: 2021-08-25 15:42:02
 * @LastEditTime: 2021-09-01 17:46:45
 */
export function formatSizeUnits(bytes) {
    if (bytes === 0) return "0 B";
  
    let k = 1024;
  
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  
    let i = Math.floor(Math.log(bytes) / Math.log(k));
  
    var num = bytes / Math.pow(k, i);
    return num.toPrecision(3) + " " + sizes[i];
  }
  /**
   * @description: 封装入参
   * @param {*} obj 参数对象
   * @param {*} target formdata 对象
   */
  export function handleParam(obj, target) {
    for (let [key, val] of Object.entries(obj)) {
      if (val instanceof Array) {
        for (let v of val) {
          // if (v instanceof Object) return;
          target.append(key, v);
        }
      } else {
        target.append(key, val);
      }
    }
  }
  
  /**
   * @description: 截取路由参数
   * @param {*} name
   */
  export function getQueryString() {
    let href = decodeURIComponent(window.location.href);
    let query = href.substring(href.indexOf("?") + 1);
    let vars = query.split("&");
    let obj = {};
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      obj[pair[0]] = pair[1];
    }
    return obj;
  }
  
  /**
   * @description: 下载文件
   * @param {*}
   */
  export function downloadFile(response) {
    const disposition = response.headers["content-disposition"];
    let fileName = disposition.substring(
      disposition.indexOf("filename=") + 9,
      disposition.length
    );
    fileName = decodeURI(escape(fileName));
    // 去掉双引号
    fileName = fileName.replace(/\"/g, "");
    const content = response.data;
    // 创建a标签并点击， 即触发下载
    let url = window.URL.createObjectURL(
      new Blob([content], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      })
    );
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", fileName);
    // 模拟
    document.body.appendChild(link);
    link.click();
    // 释放URL 对象
    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }
  