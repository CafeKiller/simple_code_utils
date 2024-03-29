from itertools import product  # 导入itertools模块中的product函数，用于生成笛卡尔积
import os  # 导入os模块，用于处理文件和目录

def generate_passwords(length, use_letters, use_digits, use_chars):
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()'
    if not use_letters:
        characters = ''.join([c for c in characters if not c.isalpha()])  # 如果不使用字母，则从字符集中移除所有字母
    if not use_digits:
        characters = ''.join([c for c in characters if not c.isdigit()])  # 如果不使用数字，则从字符集中移除所有数字
    if not use_chars:
        characters = ''.join([c for c in characters if c.isalnum() and (not c.isalpha() or not c.isdigit())])  # 如果不使用特殊字符，则从字符集中移除所有非字母和非数字的字符
    return [''.join(p) for p in product(characters, repeat=length)]  # 生成指定长度的密码列表，每个密码由字符集中的字符组成

def write_to_file(passwords, filename):
    with open(filename, 'a') as f:  # 以追加模式打开文件
        for password in passwords:  # 遍历密码列表
            f.write(password + '\n')  # 将密码写入文件，并在每个密码后添加换行

def split_file(file_path, max_size):
    # 检查文件是否存在
    if not os.path.exists(file_path):
        print("文件不存在")
        return
    # 获取文件大小
    file_size = os.path.getsize(file_path)
    # 如果文件大小小于等于指定大小，直接返回
    if file_size <= max_size:
        return
    # 计算需要拆分的文件数量
    num = file_size // max_size + (1 if file_size % max_size > 0 else 0)
    # print(num)
    with open(file_path, 'r') as f:
        for i in range(num-1):
            with open(f"{file_path}_{i}.txt", 'w') as temp_file:
                temp_file.write(f.read(max_size))
            print(f"文件已拆分为 {file_path}_{i}.txt")
			

if __name__ == '__main__':
    passwords = generate_passwords(4, False, False, True)  # 生成长度为4的密码列表，包含字母、数字和特殊字符（可根据需要修改参数）
    #for i in range(10):  # 循环10次
    filename = f'Passwords_'  # 生成文件名
    write_to_file(passwords, filename)  # 将密码列表写入文件
    split_file(filename, 5 * 1024 * 1024)  # 将文件分割为最大不超过5MB的新文件