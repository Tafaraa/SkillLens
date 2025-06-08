import os
import time
import tempfile
from typing import Dict, List, Tuple, Any
import radon.complexity as radon_cc
from radon.visitors import ComplexityVisitor
import pygount
from pathlib import Path

def calculate_cyclomatic_complexity(code_contents: Dict[str, List[str]]) -> float:
    """
    Calculate average cyclomatic complexity for code contents
    
    Args:
        code_contents: Dictionary mapping languages to lists of code content
        
    Returns:
        float: Average cyclomatic complexity score
    """
    total_complexity = 0.0
    total_blocks = 0
    
    for language, contents in code_contents.items():
        for content in contents:
            # Only process Python files with radon
            if language.lower() == "python":
                try:
                    # Parse the code and calculate complexity
                    visitor = ComplexityVisitor.from_code(content)
                    if visitor.functions or visitor.classes:
                        for func in visitor.functions:
                            total_complexity += func.complexity
                            total_blocks += 1
                        
                        for cls in visitor.classes:
                            for method in cls.methods:
                                total_complexity += method.complexity
                                total_blocks += 1
                except Exception:
                    # Skip files that can't be parsed
                    pass
            else:
                # For non-Python files, use a simple estimation based on code structure
                # This is a very basic approximation
                lines = content.split('\n')
                control_structures = 0
                for line in lines:
                    line = line.strip()
                    # Count control structures as indicators of complexity
                    if any(keyword in line for keyword in ['if ', 'else ', 'for ', 'while ', 'switch', 'case ', 'try ', 'catch ']):
                        control_structures += 1
                
                if len(lines) > 0:
                    # Simple approximation: control structures / lines of code * 10
                    estimated_complexity = (control_structures / len(lines)) * 10
                    total_complexity += estimated_complexity
                    total_blocks += 1
    
    # Return average complexity, default to 1.0 if no blocks were analyzed
    return round(total_complexity / max(total_blocks, 1), 1)

def calculate_tech_diversity(code_contents: Dict[str, List[str]], libraries: List[str]) -> int:
    """
    Calculate tech stack diversity based on languages and libraries
    
    Args:
        code_contents: Dictionary mapping languages to lists of code content
        libraries: List of detected libraries
        
    Returns:
        int: Tech stack diversity score
    """
    # Count unique languages and libraries
    unique_languages = set(lang.lower() for lang in code_contents.keys() if lang.lower() != "unknown")
    unique_libraries = set(lib.lower() for lib in libraries)
    
    # Return total count of unique technologies
    return len(unique_languages) + len(unique_libraries)

def determine_developer_rank(complexity_score: float, diversity_score: int) -> str:
    """
    Determine developer rank based on complexity and diversity scores
    
    Args:
        complexity_score: Average cyclomatic complexity score
        diversity_score: Tech stack diversity score
        
    Returns:
        str: Developer rank (Beginner, Intermediate, Advanced, Expert)
    """
    # Simple ranking algorithm
    if complexity_score < 2.0 and diversity_score < 3:
        return "Beginner"
    elif complexity_score < 3.0 and diversity_score < 5:
        return "Intermediate"
    elif complexity_score < 4.0 and diversity_score < 8:
        return "Advanced"
    else:
        return "Expert"

def calculate_skill_level_distribution(skills: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Calculate distribution of skill levels
    
    Args:
        skills: List of skill objects with scores
        
    Returns:
        Dict[str, int]: Distribution of skill levels
    """
    distribution = {
        "Beginner": 0,
        "Intermediate": 0,
        "Advanced": 0,
        "Expert": 0
    }
    
    for skill in skills:
        score = skill.get("score", 0) * 100  # Convert 0-1 to 0-100
        
        if score < 40:
            distribution["Beginner"] += 1
        elif score < 70:
            distribution["Intermediate"] += 1
        elif score < 90:
            distribution["Advanced"] += 1
        else:
            distribution["Expert"] += 1
    
    return distribution

def calculate_category_average(skills: List[Dict[str, Any]], category: str) -> int:
    """
    Calculate average score for a specific skill category
    
    Args:
        skills: List of skill objects with scores and categories
        category: Category to calculate average for
        
    Returns:
        int: Average score for the category (0-100)
    """
    category_skills = [s for s in skills if s.get("category", "").lower() == category.lower()]
    
    if not category_skills:
        return 0
    
    total_score = sum(s.get("score", 0) for s in category_skills)
    avg_score = (total_score / len(category_skills)) * 100  # Convert 0-1 to 0-100
    
    return round(avg_score)

def analyze_file_content(file_path: str) -> Tuple[int, str]:
    """
    Analyze a single file to count lines of code and detect language
    
    Args:
        file_path: Path to the file
        
    Returns:
        Tuple[int, str]: Lines of code and detected language
    """
    try:
        # Use pygount to count lines and detect language
        analysis = pygount.source_analysis(file_path, "pygount")
        return analysis.code, analysis.language
    except Exception:
        # Fallback to simple line counting if pygount fails
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')
                # Filter out empty lines and comments (simple heuristic)
                code_lines = [line for line in lines if line.strip() and not line.strip().startswith(('#', '//', '/*', '*', '<!--'))]
                return len(code_lines), os.path.splitext(file_path)[1].lstrip('.')
        except Exception:
            return 0, "unknown"

def analyze_upload_content(content: bytes, filename: str) -> Tuple[int, Dict[str, int], float]:
    """
    Analyze uploaded content to get summary statistics
    
    Args:
        content: File content as bytes
        filename: Name of the file
        
    Returns:
        Tuple[int, Dict[str, int], float]: Total lines, language counts, and processing time
    """
    start_time = time.time()
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as temp_file:
        temp_file.write(content)
        temp_path = temp_file.name
    
    try:
        # Analyze the file
        lines, language = analyze_file_content(temp_path)
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        return lines, {language: lines}, processing_time
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_path)
        except Exception:
            pass

def analyze_directory_content(directory_path: str) -> Tuple[int, Dict[str, int], float, int]:
    """
    Analyze directory content to get summary statistics
    
    Args:
        directory_path: Path to the directory
        
    Returns:
        Tuple[int, Dict[str, int], float, int]: Total lines, language counts, processing time, and file count
    """
    start_time = time.time()
    total_lines = 0
    language_counts = {}
    file_count = 0
    
    # Walk through directory
    for root, _, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            
            # Skip binary files and very large files
            if Path(file_path).stat().st_size > 1024 * 1024:  # Skip files larger than 1MB
                continue
                
            # Analyze file
            lines, language = analyze_file_content(file_path)
            
            if lines > 0:
                total_lines += lines
                file_count += 1
                
                # Update language counts
                if language in language_counts:
                    language_counts[language] += lines
                else:
                    language_counts[language] = lines
    
    # Calculate processing time
    processing_time = (time.time() - start_time) * 1000  # Convert to milliseconds
    
    return total_lines, language_counts, processing_time, file_count
