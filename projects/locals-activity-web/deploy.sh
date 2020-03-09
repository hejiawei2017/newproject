npm install

project_list=("preInsurance" "20181022registeredH5" "20190221visaInterview" "20190109cleanKeeping")
for data in ${project_list[@]}
do
    echo $data;
    npm run build --m=$data
done