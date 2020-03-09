import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import {myToast,equar} from "../../../js/util"

let _option = ["a","b","c","d"]
export default function build(array,type,data){//data类型 需要传data
    switch(type)
    {
    case "schema":
      let reData = {}
      array.forEach((obj,index)=>{
        reData[`s${index+1}`] = {
          fields: [
            {
              type: obj.isMultiple ? 'checklist' : 'select',
              featured: true,
              required: true,
              label: obj.title,
              multi: true,
              model: `q${index+1}`,
              values: _option,
              selectOptions:{
                hideNoneSelectedText: true
              },
              validator: function(val){
                  return (val=="") ? "答案不能为空" : true;
              }
            }
          ]
        }
      })
      return reData
    case "html":
      let reHtml = ''
      array.forEach((obj,index)=>{
        reHtml += `<vue-form-generator :schema="s${index+1}" :model="model" :options="formOptions"></vue-form-generator>
                  <div class="mb-20">${obj.question}</div>`
      })
      return reHtml
    case "data":
      let reSum = 0
      for(let index=0 ;index <array.length ; index++){
        let _self = data[`q${index+1}`]
        if(_self){
          if(array[index].isMultiple){
            equar(_self,array[index].answer)
            if(equar(_self,array[index].answer)){
              reSum = reSum + array[index].score
            }
          }else{
            if(JSON.stringify(_self) == JSON.stringify(array[index].answer)){
              reSum = reSum + array[index].score
            }
          }
        }else{
          myToast(`第${index+1}答案为空，请答题！ `)
          return false
        }
      }
      console.log(reSum)
      return reSum
    default :
      return ""
    }
  }
  