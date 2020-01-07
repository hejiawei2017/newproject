#!/bin/bash
project_path=$(pwd ./)
IS_PROD=$(grep -cw "const env = \"prod\"" ./config/env-config.js)
IS_PRE=$(grep -cw "const env = \"pre\"" ./config/env-config.js)
IS_DEV=$(grep -cw "const env = \"dev\"" ./config/env-config.js)

if (( IS_DEV > 0 ))
then
  echo "当前是开发环境，无法上传"
else
  if (( IS_PROD > 0 || IS_PRE > 0 ))
  then
    if (( IS_PROD > 0 ))
      then
      echo "当前是生产环境"
    fi
    if (( IS_PRE > 0 ))
      then
      echo "当前是预生产环境"
    fi
    version=$1
    description=$2

    if [ -z $version ]
    then
      echo "版本号不能为空!"
    else
      if [ -z $description ]
      then
        echo "描述不能为空!"
      else
        echo "设置当前版本..."
        sed -i '' "1 c\   
        const version = '$version';
        " ./config/version-config.js
        git add .
        git commit -m "feat: 修改版本号"
        git tag "v$version"
        
        echo "开始上传小程序..."
        /Applications/wechatwebdevtools.app/Contents/MacOS/cli -u $version@$project_path --upload-desc $description

        git push
      fi
    fi
  fi
fi
