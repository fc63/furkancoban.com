function convertCode() {
    const input = document.getElementById("codeInput").value;
    let output = "";
    
    const lines = input.split("\n");
    
    lines.forEach(line => {
        output += `printf("${line.replace(/"/g, '\\"')}\\n");\n`;
    });

    document.getElementById("output").textContent = output;
}
