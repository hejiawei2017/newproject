import centerMainDataSource from './centerMain'
import intellectualDataSource from './intellectual'
import industryDataSource from './industry'
import InspectionDataSource from './Inspection'
import consumerDataSource from './consumer'

const dataSourceMap = {
  centerMain : centerMainDataSource,
  intellectual: intellectualDataSource,
  industry : industryDataSource,
  Inspection : InspectionDataSource,
  consumer : consumerDataSource

}
export default dataSourceMap
