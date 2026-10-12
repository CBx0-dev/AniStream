export interface InformationModel {
    current_version: string;
    latest_version: string | null;
    release_notes_url: string | null;
    min_client_version: string;
    max_client_version: string;
}