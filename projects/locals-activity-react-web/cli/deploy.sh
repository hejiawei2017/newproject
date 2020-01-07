#!/bin/bash
UAT="0"
PROD="1"

# UAT_BASE_API="http://tp.localhome.cn:10000"
UAT_BASE_API="https://i.localhome.cn"
PROD_BASE_API="https://i.localhome.cn"

BASE_API=""
ACTIVITY_ID=""
ONLINE=0

NODE_MODULES_PATH="$(pwd)/node_modules"

if [[ ! -d $NODE_MODULES_PATH ]]
then
  echo "node_modules 路径不存在: $NODE_MODULES_PATH"
  exit 1
fi

# echo "输入你的活动ID："
# read read_activity_id

# UAT_ACTIVITY_ID=$read_activity_id
# PROD_ACTIVITY_ID=$read_activity_id

echo "输入你需要打包的活动名称："
read activity_name

ACTIVITY_PATH="$(pwd)/src/pages/${activity_name}"

if [[ ! -d $ACTIVITY_PATH ]]
then
  echo "活动文件不存在: $ACTIVITY_PATH"
  exit 1
fi

ACTIVITY_CONFIG_PATH="$(pwd)/src/pages/${activity_name}/deploy.json"

if [[ ! -f $ACTIVITY_CONFIG_PATH ]]
then
  echo "活动配置文件不存在: $ACTIVITY_CONFIG_PATH"
  exit 1
fi

# 不需要分测试版与正式版
# echo "选择打包的版本: 测试版(0), 正式版(1)"
# read devlop_type

echo "该版本是否替换线上版本: 是(y) 否(n)"
read online

INSTALL_DEPEND()
{
  echo "安装依赖中..."
  npm i axios ali-oss -D
}

if [ ! -d "$NODE_MODULES_PATH/axios" ]
then
  echo "缺少依赖: axios"
  INSTALL_DEPEND
fi

if [ ! -d "$NODE_MODULES_PATH/ali-oss" ]
then
  echo "缺少依赖: ali-oss"
  INSTALL_DEPEND
fi

# if [[ $devlop_type == $UAT ]]
# then
#   BASE_API=$UAT_BASE_API
#   ACTIVITY_ID=$UAT_ACTIVITY_ID
# else
#   BASE_API=$PROD_BASE_API
#   ACTIVITY_ID=$PROD_ACTIVITY_ID
# fi

BASE_API=$PROD_BASE_API
# ACTIVITY_ID=$PROD_ACTIVITY_ID

if [[ $online == "y" ]]
then
  ONLINE=1
else
  ONLINE=0
fi

# 打包
IS_NEED_ACTIVITY_ID=1 \
REACT_APP_BASE_API=$BASE_API \
PUBLIC_URL=https://oss.localhome.cn/localhomeqy \
ACTIVITY_CONFIG_PATH=${ACTIVITY_CONFIG_PATH} \
node scripts/build.js --BUILD_ENV prod ${activity_name}

if [[ $? == 1 ]]
then
  echo "build 异常"
  exit 1
fi

# 上传 oss
ACTIVITY_CONFIG_PATH=${ACTIVITY_CONFIG_PATH} \
ACTIVITY_NAME=$activity_name \
node cli/upload-oss

if [[ $? == 1 ]]
then
  echo "上传 oss 异常"
  exit 1
fi

# 上传 html
ACTIVITY_CONFIG_PATH=${ACTIVITY_CONFIG_PATH} \
BASE_API=$BASE_API \
ONLINE=$ONLINE \
ACTIVITY_NAME=$activity_name \
node cli/upload-html

if [[ $? == 1 ]]
then
  echo "上传 html 异常"
  exit 1
fi
