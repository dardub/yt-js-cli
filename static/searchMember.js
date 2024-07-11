export default async function searchMember(needle) {
    const queryParam = new URLSearchParams({ s: needle });
    const url = new URL("/search-member/?" + queryParam);

    const data = await fetch( url.toString() )
    const json = await data.json();

    

}