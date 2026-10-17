import "server-only";

import { localSearchDocuments } from "@/data/search-content";
import { connectToDatabase } from "@/lib/mongodb";
import SearchContent from "@/models/SearchContent";
import type { SearchDocument } from "@/types/search";

export async function getSearchDocuments(): Promise<SearchDocument[]> {
  try {
    const connection = await connectToDatabase();

    if (!connection) return localSearchDocuments;

    const databaseDocuments = await SearchContent.find({ isPublic: true })
      .select("-_id id page pageLabel title section content keywords url isPublic")
      .lean<SearchDocument[]>();

    return databaseDocuments.length > 0 ? databaseDocuments : localSearchDocuments;
  } catch {
    return localSearchDocuments;
  }
}
