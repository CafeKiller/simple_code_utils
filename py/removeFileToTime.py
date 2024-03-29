import os  
import shutil  
import datetime  
  
# 源目录和目标目录  
src_dir = 'D:/source_directory'  
dst_dir = 'D:/destination_directory'  
  
# 获取源目录中的所有文件  
files = [f for f in os.listdir(src_dir) if os.path.isfile(os.path.join(src_dir, f))]  
  
# 遍历文件列表  
for file in files:  
    # 构建源文件路径和目标文件路径  
    src_file = os.path.join(src_dir, file)  
    dst_file = os.path.join(dst_dir, file)  
      
    # 获取文件的修改时间  
    mod_time = os.path.getmtime(src_file)  
    mod_time_dt = datetime.datetime.fromtimestamp(mod_time)  # 将秒数转换为datetime对象  
      
    # 获取文件的年月格式的修改时间  
    year_month = mod_time_dt.strftime('%Y年%m月')  
      
    # 构建目标目录路径  
    dst_dir_path = os.path.join(dst_dir, year_month)  
    if not os.path.exists(dst_dir_path):  
        os.makedirs(dst_dir_path)  
      
    # 将文件移动到目标目录  
    shutil.move(src_file, dst_dir_path)