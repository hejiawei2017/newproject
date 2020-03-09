#!/bin/bash
# stop nginx
# sudo nginx -s stop

# detact the variation of package.json
# CHANGE=$(git diff package.json)
BEFORE_DIGEST=$(cat md5.txt) || ""
CURRENT_DIGEST=$(cat package.json|md5sum)

# SIGN
INSTALLING="dependencies installing"
BUILDING="application building"
RESTARTING="restarting nginx"
CHANGE_MSG="dependencies has changed, npm install required!"

# handler
PackageChanged() {
    echo $INSTALLING
    npm install
    echo $BUILDING
    npm run build
    # echo $RESTARTING
}

PackageUnchanged() {
    echo $BUILDING
    npm run build
    echo $RESTARTING
}
# cannot not detact diff
if [ "$CURRENT_DIGEST" == "$BEFORE_DIGEST" ];
then
    PackageUnchanged
else
    echo $CHANGE_MSG;
    PackageChanged
fi

$(cat package.json|md5sum > md5.txt)
# restart nginx
# sudo nginx

# 企业微信机器人
# 将任务放到 post build task 中
# node scripts/robot
