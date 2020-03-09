import Ajax from '../utils/axios.js'

export default {
    getSelectList: () => Ajax.get('/fire/cost-type/type-subject'),
    getTable: (data) => Ajax.post('/fire/cost-house/page-list', data),
    delItem: (data) => Ajax.post('/fire/cost-house/delete-batch', data),
    importAccessory: (data) => Ajax.post('/fire/cost-house/upload-attachment', data),
    importFile: (file) => Ajax.uploadPost('/fire/cost-house/import', file)
}