# import subprocess

# HOST="speedtest.net"
# response = subprocess.run(["ping", "-c", "1", HOST], capture_output=True, text=True)
# print(response.stdout)

import subprocess

command = ['ping', '-c', '1', 'speedtest.net']
output = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

try:
    latency = float(output.stdout.split('time=')[1].split()[0])
    print(f"Latency: {latency} ms")
except:
    print("Error: Failed to retrieve latency value.")
