using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AniStream.Models;

[Table("sync_provider_job_result")]
[PrimaryKey(nameof(SyncProviderJobResultId))]
public sealed class SyncProviderJobResultModel
{
    public int SyncProviderJobResultId { get; set; }

    public int SyncProviderJobId { get; set; }

    public string Provider { get; set; }

    public string Url { get; set; }

    public int LanguageCode { get; set; }

    public SyncProviderJobResultModel(
        int syncProviderJobResultId,
        int syncProviderJobId,
        string provider,
        string url,
        int languageCode
    )
    {
        SyncProviderJobResultId = syncProviderJobResultId;
        SyncProviderJobId = syncProviderJobId;
        Provider = provider;
        Url = url;
        LanguageCode = languageCode;
    }

    public SyncProviderJobResultModel(
        int syncProviderJobId,
        string provider,
        string url,
        int languageCode
    ) : this(
        0,
        syncProviderJobId,
        provider,
        url,
        languageCode
    )
    {
    }
}