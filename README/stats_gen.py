import json
import matplotlib.pyplot as plt
import os

def format_size(size_bytes):
    if size_bytes == '-':
        return '-'
    try:
        size = float(size_bytes)
    except ValueError:
        return size_bytes
    
    if size < 1000:
        return f"{size:.2f} B"
    elif size < 1000 * 1000:
        return f"{size / 1000:.2f} KB"
    else:
        return f"{size / (1000 * 1000):.2f} MB"

def generate_stats():
    # Load stats.json
    stats_file = 'stats.json'
    if not os.path.exists(stats_file):
        # Fallback for when running from the root (e.g., python README/stats_gen.py)
        stats_file = os.path.join('README', 'stats.json')
    
    if not os.path.exists(stats_file):
        print(f"Error: {stats_file} not found.")
        return

    with open(stats_file, 'r') as f:
        data = json.load(f)

    if not data:
        print("Error: stats.json is empty.")
        return

    # Extract tags (X-axis)
    tags = [entry['tag'] for entry in data]
    
    # Identify all unique asset names
    asset_names = set()
    for entry in data:
        asset_names.update(entry['assets'].keys())
    
    # Sort asset names to keep consistent legend order
    asset_names = sorted(list(asset_names))

    # Prepare data for plotting (Y-axis)
    # Each asset will have a list of sizes corresponding to each tag (in Bytes)
    asset_data = {name: [] for name in asset_names}
    for entry in data:
        for name in asset_names:
            size_bytes = entry['assets'].get(name, 0) # Use 0 if asset is missing for a tag
            asset_data[name].append(size_bytes)

    # Define groupings
    groupings = {
        "SourceCode": ["assets", "changelogs", "css", "html", "javascript"],
        "x86_64": [name for name in asset_names if "x86_64" in name.lower()],
        "amd64": [name for name in asset_names if "amd64" in name.lower()],
        "aarch64": [name for name in asset_names if "aarch64" in name.lower()]
    }

    # Ensure graphs directory exists
    # If we are in the README folder, graphs are in graphs/
    # If we are in the project root, graphs are in README/graphs/
    if os.path.basename(os.getcwd()) == 'README':
        graphs_dir = 'graphs'
    else:
        graphs_dir = os.path.join('README', 'graphs')
    
    if not os.path.exists(graphs_dir):
        os.makedirs(graphs_dir)
        print(f"Created directory {graphs_dir}")

    graph_filenames = []
    for group_name, members in groupings.items():
        if not members:
            continue
            
        plt.figure(figsize=(15, 8))
        has_data = False
        
        # Define factor and unit based on group
        if group_name == "SourceCode":
            factor = 1000
            unit = "KB"
        else:
            factor = 1000 * 1000
            unit = "MB"

        for name in members:
            if name in asset_data:
                # Find the first index where the asset has a size > 0
                raw_sizes = asset_data[name]
                first_non_zero = -1
                for i, size in enumerate(raw_sizes):
                    if size > 0:
                        first_non_zero = i
                        break
                
                if first_non_zero != -1:
                    # Convert to target unit
                    converted_sizes = [s / factor for s in raw_sizes[first_non_zero:]]
                    # Plot only from the first non-zero size to the end
                    # Use numeric indices for X-axis to ensure consistent mapping
                    x_values = range(first_non_zero, len(tags))
                    plt.plot(x_values, converted_sizes, marker='o', label=name)
                    has_data = True
        
        if not has_data:
            plt.close()
            continue

        plt.title(f'{group_name} File sizes over Versions')
        plt.xlabel('Tags')
        plt.ylabel(f'Filesize ({unit})')
        plt.xticks(range(len(tags)), tags)
        plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left', borderaxespad=0.)
        plt.grid(True, linestyle='--', alpha=0.7)
        plt.tight_layout()

        # Save the graph
        filename = f'{group_name.lower()}.png'
        graph_path = os.path.join(graphs_dir, filename)
        
        plt.savefig(graph_path)
        plt.close()
        graph_filenames.append((group_name, filename))
        print(f"Graph saved to {graph_path}")

    # Generate Stats.md
    md_content = "# Project Statistics\n\n"
    
    for group_name, filename in graph_filenames:
        md_content += f"## {group_name} Assets\n\n"
        # The markdown is in the root, and images are in README/graphs/
        md_content += f"![{group_name} File sizes](README/graphs/{filename})\n\n"
        
        # Mini-table for this group
        members = [m for m in groupings[group_name] if m in asset_names]
        if members:
            # Header: Tag as first column, then all tags
            header = "| Asset | " + " | ".join([f"**{t}**" for t in tags]) + " |\n"
            separator = "| --- | " + " | ".join(["---"] * len(tags)) + " |\n"
            md_content += header
            md_content += separator
            
            # Rows: One row per asset
            for name in members:
                row_values = []
                for entry in data:
                    size = entry['assets'].get(name, '-')
                    row_values.append(format_size(size))
                md_content += f"| {name} | " + " | ".join(row_values) + " |\n"
            md_content += "\n"
    
    # Generate Total Comparison Table
    md_content += "## Total Comparison\n\n"
    
    # Header: Asset as first column, then all tags
    header = "| Asset | " + " | ".join([f"**{t}**" for t in tags]) + " |\n"
    separator = "| --- | " + " | ".join(["---"] * len(tags)) + " |\n"
    md_content += header
    md_content += separator
    
    # Rows: One row per asset
    for name in asset_names:
        row_values = []
        for entry in data:
            size = entry['assets'].get(name, '-')
            row_values.append(format_size(size))
        md_content += f"| {name} | " + " | ".join(row_values) + " |\n"

    stats_md_path = 'Stats.md'
    if os.path.basename(os.getcwd()) == 'README':
        stats_md_path = os.path.join('..', 'Stats.md')
        
    with open(stats_md_path, 'w') as f:
        f.write(md_content)
    print(f"Stats.md generated at {stats_md_path}")

if __name__ == "__main__":
    generate_stats()
