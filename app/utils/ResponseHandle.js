export function ResponseHandle(response) {
  console.log("handleApiErrors", response);
  const contentType = response.headers.get("content-type");
  if (!response.ok) {
    return exceptionHandle(contentType, response)
  }
  return okHandle(contentType, response)
}

function exceptionHandle(contentType, response) {
  if (contentType == null) {
    return response.text().then(text => {
      return Promise.reject(text)
    })
  }

  if (contentType.indexOf("application/json") !== -1) {
    return response.json().then(json => {
      return Promise.reject(json)
    })
  } else {
    return response.text().then(text => {
      return Promise.reject(text)
    })
  }
}

function okHandle(contentType, response) {
  if (contentType == null) return response.text()
  if (contentType.indexOf("application/json") !== -1) {
    return response.json()
  } else {
    return response.text()
  }
}
