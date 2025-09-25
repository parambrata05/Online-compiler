import subprocess
import tempfile
import os

def run_code(language: str, code: str, input_str: str = ""):
    """Run code in given language with optional stdin input."""
    try:
        if language == "python":
            with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as f:
                f.write(code.encode())
                f.flush()
                result = subprocess.run(
                    ["python", f.name],
                    input=input_str,               # ✅ feed stdin
                    capture_output=True,
                    text=True,
                    timeout=5
                )
        elif language == "cpp":
            with tempfile.NamedTemporaryFile(suffix=".cpp", delete=False) as f:
                f.write(code.encode())
                f.flush()
                exe_file = f.name.replace(".cpp", "")
                subprocess.run(["g++", f.name, "-o", exe_file], capture_output=True, text=True)
                result = subprocess.run([exe_file], input=input_str, capture_output=True, text=True, timeout=5)
        elif language == "c":
            with tempfile.NamedTemporaryFile(suffix=".c", delete=False) as f:
                f.write(code.encode())
                f.flush()
                exe_file = f.name.replace(".c", "")
                subprocess.run(["gcc", f.name, "-o", exe_file], capture_output=True, text=True)
                result = subprocess.run([exe_file], input=input_str, capture_output=True, text=True, timeout=5)
        elif language == "java":
            with tempfile.TemporaryDirectory() as tmpdir:
                java_file = os.path.join(tmpdir, "Main.java")
                with open(java_file, "w") as f:
                    f.write(code)
                subprocess.run(["javac", java_file], capture_output=True, text=True, timeout=5)
                result = subprocess.run(
                    ["java", "-cp", tmpdir, "Main"],
                    input=input_str,                 # ✅ feed stdin
                    capture_output=True,
                    text=True,
                    timeout=5
                )
        elif language == "javascript":
            with tempfile.NamedTemporaryFile(suffix=".js", delete=False) as f:
                f.write(code.encode())
                f.flush()
                result = subprocess.run(
                    ["node", f.name],
                    input=input_str,                 # ✅ feed stdin
                    capture_output=True,
                    text=True,
                    timeout=5
                )
        else:
            return {"error": f"Language {language} not supported"}

        return {"stdout": result.stdout, "stderr": result.stderr}

    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out"}
