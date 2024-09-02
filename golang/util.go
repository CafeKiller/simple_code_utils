// var r *http.Request
ip := exnet.ClientPublicIP(r)
if ip == ""{
  ip = exnet.ClientIP(r)
}

// ClientPublicIP 尽最大努力实现获取客户端公网 IP 的算法。
// 解析 X-Real-IP 和 X-Forwarded-For 以便于反向代理（nginx 或 haproxy）可以正常工作。
func ClientPublicIP(r *http.Request) string {
	var ip string
	for _, ip = range strings.Split(r.Header.Get("X-Forwarded-For"), ",") {
		ip = strings.TrimSpace(ip)
		if ip != "" && !HasLocalIPddr(ip) {
			return ip
		}
	}

	ip = strings.TrimSpace(r.Header.Get("X-Real-Ip"))
	if ip != "" && !HasLocalIPddr(ip) {
		return ip
	}

	if ip, _, err := net.SplitHostPort(strings.TrimSpace(r.RemoteAddr)); err == nil {
		if !HasLocalIPddr(ip) {
			return ip
		}
	}

	return ""
}

// HasLocalIPddr 检测 IP 地址字符串是否是内网地址
func HasLocalIPddr(ip string) bool {
	return HasLocalIP(net.ParseIP(ip))
}

// HasLocalIP 检测 IP 地址是否是内网地址
func HasLocalIP(ip net.IP) bool {
	for _, network := range localNetworks {
		if network.Contains(ip) {
			return true
		}
	}

	return ip.IsLoopback()
}

// RemoteIP 通过 RemoteAddr 获取 IP 地址， 只是一个快速解析方法。
func RemoteIP(r *http.Request) string {
	if ip, _, err := net.SplitHostPort(strings.TrimSpace(r.RemoteAddr)); err == nil {
		return ip
	}

	return ""
}


// RemoveDuplicate 两个list合并去重
func RemoveDuplicate(arr []string) []string {

	// 创建一个空map, 用于标识元素是否已存在
	tmap := make(map[string]bool)
	// 创建一个新的字符串切片用于存储新去重后的元素
	result := []string{}

	// 遍历
	for _, str := range arr {
		// 判断元素是否存在与map中, 不存在则加入result, 存在则在tmap中标识
		if _, ok := tmap[str];!ok {
			tmap[str] = true
			result = append(result, str)
		}
	}
	return result
}