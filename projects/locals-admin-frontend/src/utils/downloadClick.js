const downloadTemplateClick = (url, fileName, target) => {
    if(typeof url === 'object' && url instanceof Blob){
        url = URL.createObjectURL(url)
    }
    var aLink = document.createElement('a')
    aLink.href = url
    aLink.download = fileName || ''
    target && (aLink.target = '_blank')
    var event
    if(window.MouseEvent){
        event = new MouseEvent('click')
    } else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    }
    aLink.dispatchEvent(event)
}
export default downloadTemplateClick