using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("list")]
[PrimaryKey(nameof(ListId))]
public sealed class ListModel
{
    public int ListId { get; set; }

    public string Name { get; set; }

    public string TenantId { get; set; }

    public ListModel(string name, string tenantId) : this(0, name, tenantId)
    {
    }

    public ListModel(int listId, string name, string tenantId)
    {
        ListId = listId;
        Name = name;
        TenantId = tenantId;
    }
}