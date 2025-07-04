import type { Backend } from "../scripts/types/provenance";



export function orderNodeRelationsByTemplate(

    unsortedRelations: Backend.Relations
): Backend.Relations {
    console.log("unsortedRelations: ", Object.keys(unsortedRelations))
    // TODO: order here some nodes like nomad job or the application node
    return {};
}
