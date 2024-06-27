## FileIO

### Reading from a File

```go
import "os"

func ReadTextFile(filename string) (string, error) {
	fileContent, err := os.ReadFile(filename)
	if err != nil {
		// Error Reading File
		return "", err
	} else {
		return string(fileContent), nil
	}
}
```

### Writing to a File

```go
import "os"

func WriteToFile(filename string, content string) error {
	return os.WriteFile(filename, []byte(content), 0644)
}
```

- Main Function

```go

func main() {
	// Absolute path not required (relative path also works)
	rootPath, _ := os.Getwd()
	fmt.Println(rootPath)
	filePath := rootPath + "/data/text.txt"
	content, err := fileutils.ReadTextFile(filePath)
	if err == nil {
		fmt.Println(content)
		
		newContent := fmt.Sprintf(
			"Orignal: %v\nDouble Orignal: %v%v",
			content,
			content,
			content,
		)
		
		fileutils.WriteToFile(filePath, newContent)
	} else {
		fmt.Printf("ERROR PANIC %v", err)
	}
	
}
```
