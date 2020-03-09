import Ajax from '../utils/axios.js'

export default {
    getTable: (data) => {//done
        return Ajax.get('/contract/talents/getTalentsList', data)
    },
    update: (data) => {//done
        return Ajax.post(`/contract/talents/updateTalent`, data)
    },
    getConfig: (data) => {//done
        return Ajax.get('/base/system-parameters', data)
    }
}