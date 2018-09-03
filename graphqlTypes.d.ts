export const typeDefs = ["type Achievement {\n  author: User!\n  basePoints: Int!\n  category: Category!\n  expires: Int\n  hasParents: Boolean!\n  icon: String!\n  id: ID!\n  isGlobal: Boolean!\n  isMultiPlayer: Boolean!\n  longDescription: String\n  mode: Mode!\n  name: String!\n  objectives: [Objective!]!\n  points: Float!\n  requestReview: Boolean!\n  shortDescription: String!\n  type: Type!\n}\n\n# The connection type for Achievement.\ntype AchievementConnection {\n  # A list of edges.\n  edges: [AchievementEdge]\n\n  # Information to aid in pagination.\n  pageInfo: PageInfo!\n}\n\n# An edge in a connection.\ntype AchievementEdge {\n  # A cursor for use in pagination.\n  cursor: String!\n\n  # The item at the end of the edge.\n  node: Achievement\n}\n\ntype Category {\n  icon: String!\n  id: ID!\n  points: Int!\n  title: String!\n}\n\n# The connection type for Category.\ntype CategoryConnection {\n  # A list of edges.\n  edges: [CategoryEdge]\n\n  # Information to aid in pagination.\n  pageInfo: PageInfo!\n}\n\n# An edge in a connection.\ntype CategoryEdge {\n  # A cursor for use in pagination.\n  cursor: String!\n\n  # The item at the end of the edge.\n  node: Category\n}\n\ntype Continent {\n  id: ID!\n  name: String!\n  regions: [Region!]!\n}\n\n# The connection type for Continent.\ntype ContinentConnection {\n  # A list of edges.\n  edges: [ContinentEdge]\n\n  # Information to aid in pagination.\n  pageInfo: PageInfo!\n}\n\n# An edge in a connection.\ntype ContinentEdge {\n  # A cursor for use in pagination.\n  cursor: String!\n\n  # The item at the end of the edge.\n  node: Continent\n}\n\ntype Country {\n  id: ID!\n  name: String!\n  region: Region!\n}\n\n# The connection type for Country.\ntype CountryConnection {\n  # A list of edges.\n  edges: [CountryEdge]\n\n  # Information to aid in pagination.\n  pageInfo: PageInfo!\n}\n\n# An edge in a connection.\ntype CountryEdge {\n  # A cursor for use in pagination.\n  cursor: String!\n\n  # The item at the end of the edge.\n  node: Country\n}\n\nunion Goal = Location\n\ntype Icon {\n  id: ID!\n  name: String!\n}\n\n# The connection type for Icon.\ntype IconConnection {\n  # A list of edges.\n  edges: [IconEdge]\n\n  # Information to aid in pagination.\n  pageInfo: PageInfo!\n}\n\n# An edge in a connection.\ntype IconEdge {\n  # A cursor for use in pagination.\n  cursor: String!\n\n  # The item at the end of the edge.\n  node: Icon\n}\n\ntype Location {\n  altitude: Float!\n  country: Country!\n  createdAt: Int!\n  id: ID!\n  isCircular: Boolean!\n  lat: Float!\n  lng: Float!\n  title: String\n}\n\ntype Mode {\n  description: String!\n  icon: String!\n  id: ID!\n  multiplier: Float!\n  name: String!\n}\n\n# The connection type for Mode.\ntype ModeConnection {\n  # A list of edges.\n  edges: [ModeEdge]\n\n  # Information to aid in pagination.\n  pageInfo: PageInfo!\n}\n\n# An edge in a connection.\ntype ModeEdge {\n  # A cursor for use in pagination.\n  cursor: String!\n\n  # The item at the end of the edge.\n  node: Mode\n}\n\ntype Mutation {\n  # An example field added by the generator\n  testField: String!\n}\n\ntype Objective {\n  achievements: [Achievement!]!\n  basePoints: Float!\n  createdAt: Int!\n  goal: Goal\n  goalType: String!\n  hashIdentifier: String!\n  isPublic: Boolean!\n  requiredCount: Int\n  tagline: String!\n}\n\n# Information about pagination in a connection.\ntype PageInfo {\n  # When paginating forwards, the cursor to continue.\n  endCursor: String\n\n  # When paginating forwards, are there more items?\n  hasNextPage: Boolean!\n\n  # When paginating backwards, are there more items?\n  hasPreviousPage: Boolean!\n\n  # When paginating backwards, the cursor to continue.\n  startCursor: String\n}\n\ntype Query {\n  achievements(\n    # Returns the elements in the list that come after the specified cursor.\n    after: String\n\n    # Returns the elements in the list that come before the specified cursor.\n    before: String\n    category: Int\n\n    # Returns the first _n_ elements from the list.\n    first: Int\n\n    # Returns the last _n_ elements from the list.\n    last: Int\n    mode: Int\n    multiplayer: Boolean\n    near: [Float!]\n    type: Int\n  ): AchievementConnection!\n  categories(\n    # Returns the elements in the list that come after the specified cursor.\n    after: String\n\n    # Returns the elements in the list that come before the specified cursor.\n    before: String\n\n    # Returns the first _n_ elements from the list.\n    first: Int\n\n    # Returns the last _n_ elements from the list.\n    last: Int\n  ): CategoryConnection!\n  continents(\n    # Returns the elements in the list that come after the specified cursor.\n    after: String\n\n    # Returns the elements in the list that come before the specified cursor.\n    before: String\n\n    # Returns the first _n_ elements from the list.\n    first: Int\n\n    # Returns the last _n_ elements from the list.\n    last: Int\n    search: String\n  ): ContinentConnection!\n  countries(\n    # Returns the elements in the list that come after the specified cursor.\n    after: String\n\n    # Returns the elements in the list that come before the specified cursor.\n    before: String\n\n    # Returns the first _n_ elements from the list.\n    first: Int\n\n    # Returns the last _n_ elements from the list.\n    last: Int\n    search: String\n  ): CountryConnection!\n  currentUser: User!\n  icons(\n    # Returns the elements in the list that come after the specified cursor.\n    after: String\n\n    # Returns the elements in the list that come before the specified cursor.\n    before: String\n\n    # Returns the first _n_ elements from the list.\n    first: Int\n\n    # Returns the last _n_ elements from the list.\n    last: Int\n  ): IconConnection!\n  modes(\n    # Returns the elements in the list that come after the specified cursor.\n    after: String\n\n    # Returns the elements in the list that come before the specified cursor.\n    before: String\n\n    # Returns the first _n_ elements from the list.\n    first: Int\n\n    # Returns the last _n_ elements from the list.\n    last: Int\n  ): ModeConnection!\n  regions(\n    # Returns the elements in the list that come after the specified cursor.\n    after: String\n\n    # Returns the elements in the list that come before the specified cursor.\n    before: String\n\n    # Returns the first _n_ elements from the list.\n    first: Int\n\n    # Returns the last _n_ elements from the list.\n    last: Int\n    search: String\n  ): RegionConnection!\n  types(\n    # Returns the elements in the list that come after the specified cursor.\n    after: String\n\n    # Returns the elements in the list that come before the specified cursor.\n    before: String\n\n    # Returns the first _n_ elements from the list.\n    first: Int\n\n    # Returns the last _n_ elements from the list.\n    last: Int\n  ): TypeConnection!\n}\n\ntype Region {\n  continent: Continent!\n  countries: [Country!]!\n  id: ID!\n  name: String!\n}\n\n# The connection type for Region.\ntype RegionConnection {\n  # A list of edges.\n  edges: [RegionEdge]\n\n  # Information to aid in pagination.\n  pageInfo: PageInfo!\n}\n\n# An edge in a connection.\ntype RegionEdge {\n  # A cursor for use in pagination.\n  cursor: String!\n\n  # The item at the end of the edge.\n  node: Region\n}\n\ntype Role {\n  createdAt: Int!\n  id: ID!\n  name: String!\n  permissionLevel: String!\n  users: [User!]\n}\n\ntype Type {\n  description: String!\n  icon: String!\n  id: ID!\n  name: String!\n  points: Int!\n}\n\n# The connection type for Type.\ntype TypeConnection {\n  # A list of edges.\n  edges: [TypeEdge]\n\n  # Information to aid in pagination.\n  pageInfo: PageInfo!\n}\n\n# An edge in a connection.\ntype TypeEdge {\n  # A cursor for use in pagination.\n  cursor: String!\n\n  # The item at the end of the edge.\n  node: Type\n}\n\ntype Unlocked {\n  achievement: Achievement!\n  coop: Boolean!\n  coopBonus: Float!\n  id: ID!\n  points: Float!\n  repetitionCount: Int!\n  user: User!\n}\n\ntype User {\n  country: Country!\n  email: String!\n  id: ID!\n  name: String!\n  personalPoints: Float!\n  points: Float!\n  role: Role!\n  unlocked: [Unlocked!]!\n}"];
/* tslint:disable */

export interface Query {
  achievements: AchievementConnection;
  categories: CategoryConnection;
  continents: ContinentConnection;
  countries: CountryConnection;
  currentUser: User;
  icons: IconConnection;
  modes: ModeConnection;
  regions: RegionConnection;
  types: TypeConnection;
}

export interface AchievementsQueryArgs {
  after: string | null;
  before: string | null;
  category: number | null;
  first: number | null;
  last: number | null;
  mode: number | null;
  multiplayer: boolean | null;
  near: Array<number>;
  type: number | null;
}

export interface CategoriesQueryArgs {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
}

export interface ContinentsQueryArgs {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
  search: string | null;
}

export interface CountriesQueryArgs {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
  search: string | null;
}

export interface IconsQueryArgs {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
}

export interface ModesQueryArgs {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
}

export interface RegionsQueryArgs {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
  search: string | null;
}

export interface TypesQueryArgs {
  after: string | null;
  before: string | null;
  first: number | null;
  last: number | null;
}

export interface AchievementConnection {
  edges: Array<AchievementEdge> | null;
  pageInfo: PageInfo;
}

export interface AchievementEdge {
  cursor: string;
  node: Achievement | null;
}

export interface Achievement {
  author: User;
  basePoints: number;
  category: Category;
  expires: number | null;
  hasParents: boolean;
  icon: string;
  id: string;
  isGlobal: boolean;
  isMultiPlayer: boolean;
  longDescription: string | null;
  mode: Mode;
  name: string;
  objectives: Array<Objective>;
  points: number;
  requestReview: boolean;
  shortDescription: string;
  type: Type;
}

export interface User {
  country: Country;
  email: string;
  id: string;
  name: string;
  personalPoints: number;
  points: number;
  role: Role;
  unlocked: Array<Unlocked>;
}

export interface Country {
  id: string;
  name: string;
  region: Region;
}

export interface Region {
  continent: Continent;
  countries: Array<Country>;
  id: string;
  name: string;
}

export interface Continent {
  id: string;
  name: string;
  regions: Array<Region>;
}

export interface Role {
  createdAt: number;
  id: string;
  name: string;
  permissionLevel: string;
  users: Array<User>;
}

export interface Unlocked {
  achievement: Achievement;
  coop: boolean;
  coopBonus: number;
  id: string;
  points: number;
  repetitionCount: number;
  user: User;
}

export interface Category {
  icon: string;
  id: string;
  points: number;
  title: string;
}

export interface Mode {
  description: string;
  icon: string;
  id: string;
  multiplier: number;
  name: string;
}

export interface Objective {
  achievements: Array<Achievement>;
  basePoints: number;
  createdAt: number;
  goal: Goal | null;
  goalType: string;
  hashIdentifier: string;
  isPublic: boolean;
  requiredCount: number | null;
  tagline: string;
}

export type Goal = Location;

export interface Location {
  altitude: number;
  country: Country;
  createdAt: number;
  id: string;
  isCircular: boolean;
  lat: number;
  lng: number;
  title: string | null;
}

export interface Type {
  description: string;
  icon: string;
  id: string;
  name: string;
  points: number;
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

export interface CategoryConnection {
  edges: Array<CategoryEdge> | null;
  pageInfo: PageInfo;
}

export interface CategoryEdge {
  cursor: string;
  node: Category | null;
}

export interface ContinentConnection {
  edges: Array<ContinentEdge> | null;
  pageInfo: PageInfo;
}

export interface ContinentEdge {
  cursor: string;
  node: Continent | null;
}

export interface CountryConnection {
  edges: Array<CountryEdge> | null;
  pageInfo: PageInfo;
}

export interface CountryEdge {
  cursor: string;
  node: Country | null;
}

export interface IconConnection {
  edges: Array<IconEdge> | null;
  pageInfo: PageInfo;
}

export interface IconEdge {
  cursor: string;
  node: Icon | null;
}

export interface Icon {
  id: string;
  name: string;
}

export interface ModeConnection {
  edges: Array<ModeEdge> | null;
  pageInfo: PageInfo;
}

export interface ModeEdge {
  cursor: string;
  node: Mode | null;
}

export interface RegionConnection {
  edges: Array<RegionEdge> | null;
  pageInfo: PageInfo;
}

export interface RegionEdge {
  cursor: string;
  node: Region | null;
}

export interface TypeConnection {
  edges: Array<TypeEdge> | null;
  pageInfo: PageInfo;
}

export interface TypeEdge {
  cursor: string;
  node: Type | null;
}

export interface Mutation {
  testField: string;
}
