import json
import matplotlib.pyplot as plt
import os

def format_value(value, unit):
    if value == '-':
        return '-'
    try:
        val = float(value)
    except ValueError:
        return value
    
    if unit == "%":
        return f"{val:.2f}%"
    
    if val < 1000:
        return f"{val:.2f} B"
    elif val < 1000 * 1000:
        return f"{val / 1000:.2f} KB"
    else:
        return f"{val / (1000 * 1000):.2f} MB"

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
    
    # Identify all groups and assets
    groups = ["vite dist", "source", "x86_64", "amd64", "aarch64",]
    
    # Ensure graphs directory exists
    if os.path.basename(os.getcwd()) == 'README':
        graphs_dir = 'graphs'
    else:
        graphs_dir = os.path.join('README', 'graphs')
    
    if not os.path.exists(graphs_dir):
        os.makedirs(graphs_dir)
        print(f"Created directory {graphs_dir}")

    graph_filenames = []
    
    # To store all asset names for the total comparison table
    all_assets_by_group = {group: set() for group in groups}
    for entry in data:
        for group in groups:
            if group in entry:
                all_assets_by_group[group].update(entry[group].keys())

    for group_name in groups:
        members = sorted(list(all_assets_by_group[group_name]))
        if not members:
            continue
            
        plt.figure(figsize=(15, 8))
        has_data = False
        
        # Define factor and unit based on group
        if group_name == "vite dist":
            factor = 1000
            unit = "KB"
        elif group_name == "source":
            factor = 1
            unit = "%"
        else:
            factor = 1000 * 1000
            unit = "MB"

        for name in members:
            raw_sizes = []
            for entry in data:
                size = entry.get(group_name, {}).get(name, 0)
                raw_sizes.append(size)
            
            # Find the first index where the asset has a size > 0
            first_non_zero = -1
            for i, size in enumerate(raw_sizes):
                if size > 0:
                    first_non_zero = i
                    break
            
            if first_non_zero != -1:
                # Convert to target unit
                converted_sizes = [s / factor for s in raw_sizes[first_non_zero:]]
                x_values = range(first_non_zero, len(tags))
                plt.plot(x_values, converted_sizes, marker='o', label=name)
                has_data = True
        
        if not has_data:
            plt.close()
            continue

        plt.title(f'{group_name} over Versions')
        plt.xlabel('Tags')
        plt.ylabel(f'Value ({unit})' if unit == "%" else f'Filesize ({unit})')
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
        md_content += f"![{group_name} data](README/graphs/{filename})\n\n"
        
        members = sorted(list(all_assets_by_group[group_name]))
        if members:
            # Determine unit for formatting
            unit = ""
            if group_name == "source":
                unit = "%"
            
            header = "| Asset | " + " | ".join([f"**{t}**" for t in tags]) + " |\n"
            separator = "| --- | " + " | ".join(["---"] * len(tags)) + " |\n"
            md_content += header
            md_content += separator
            
            for name in members:
                row_values = []
                for entry in data:
                    val = entry.get(group_name, {}).get(name, '-')
                    row_values.append(format_value(val, unit))
                md_content += f"| {name} | " + " | ".join(row_values) + " |\n"
            md_content += "\n"
    
    # Generate Total Comparison Table
    md_content += "## Total Comparison\n\n"
    header = "| Group | Asset | " + " | ".join([f"**{t}**" for t in tags]) + " |\n"
    separator = "| --- | --- | " + " | ".join(["---"] * len(tags)) + " |\n"
    md_content += header
    md_content += separator
    
    for group_name in groups:
        members = sorted(list(all_assets_by_group[group_name]))
        
        # Determine unit for formatting
        unit = ""
        if group_name == "source":
            unit = "%"
            
        for i, name in enumerate(members):
            row_values = []
            for entry in data:
                val = entry.get(group_name, {}).get(name, '-')
                row_values.append(format_value(val, unit))
            
            group_col = f"**{group_name}**" if i == 0 else ""
            md_content += f"| {group_col} | {name} | " + " | ".join(row_values) + " |\n"

    stats_md_path = 'Stats.md'
    if os.path.basename(os.getcwd()) == 'README':
        stats_md_path = os.path.join('..', 'Stats.md')
        
    with open(stats_md_path, 'w') as f:
        f.write(md_content)
    print(f"Stats.md generated at {stats_md_path}")

if __name__ == "__main__":
    generate_stats()
