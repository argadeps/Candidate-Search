// TODO: Create an interface for the Candidate objects returned by the API
export interface Candidate {
    login: string;
    id: number;
    name: string;
    username: string;
    location: string | null;
    avatar_url: string;
    email: string | null;
    html_url: string;
    company: string | null
    
}

//local storage of saved candidates
export interface SavedCandidateState {
    candidates: Candidate[];

}