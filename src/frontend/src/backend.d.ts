import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Input = {
    __kind__: "physicsProblem";
    physicsProblem: {
        topic: PhysicsTopic;
        values: Array<[string, number]>;
    };
} | {
    __kind__: "mathExpression";
    mathExpression: string;
} | {
    __kind__: "chemistryProblem";
    chemistryProblem: {
        topic: ChemistryTopic;
        values: Array<[string, number]>;
    };
};
export interface Item {
    id: bigint;
    mode: Mode;
    answer: Result;
    timestamp: bigint;
    input: Input;
}
export interface Result {
    steps: Array<Step>;
    finalAnswer: Answer;
}
export interface Answer {
    value: number;
    units?: string;
}
export interface Step {
    result?: number;
    calculation?: string;
    description: string;
}
export interface UserProfile {
    name: string;
}
export enum ChemistryTopic {
    ph = "ph",
    molesMassConversion = "molesMassConversion",
    dilution = "dilution",
    molarity = "molarity",
    molarMass = "molarMass",
    idealGasLaw = "idealGasLaw"
}
export enum Mode {
    math = "math",
    chemistry = "chemistry",
    physics = "physics"
}
export enum PhysicsTopic {
    kinematics = "kinematics",
    ohmsLaw = "ohmsLaw",
    newtonsSecondLaw = "newtonsSecondLaw",
    power = "power",
    workEnergy = "workEnergy"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearHistory(): Promise<void>;
    deleteHistoryItem(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversionFactor(fromUnits: string, toUnits: string): Promise<number>;
    getHistory(): Promise<Array<Item>>;
    getHistoryItem(id: bigint): Promise<Item | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listChemistryTopics(): Promise<Array<ChemistryTopic>>;
    listPhysicsTopics(): Promise<Array<PhysicsTopic>>;
    reRunHistoryItem(id: bigint): Promise<Result>;
    runCalculation(input: Input): Promise<Result>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    suggestUnits(value: number, units: string): Promise<string>;
}
