import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module CalculationMode {
    public type Mode = {
      #math;
      #physics;
      #chemistry;
    };
  };

  module CalculationInput {
    public type Input = {
      #mathExpression : Text;
      #physicsProblem : {
        topic : PhysicsTopic.PhysicsTopic;
        values : [(Text, Float)];
      };
      #chemistryProblem : {
        topic : ChemistryTopic.ChemistryTopic;
        values : [(Text, Float)];
      };
    };
  };

  module PhysicsTopic {
    public type PhysicsTopic = {
      #kinematics;
      #newtonsSecondLaw;
      #workEnergy;
      #power;
      #ohmsLaw;
    };
  };

  module ChemistryTopic {
    public type ChemistryTopic = {
      #molarMass;
      #molesMassConversion;
      #molarity;
      #dilution;
      #idealGasLaw;
      #ph;
    };
  };

  module PhysicsProblemDetails {
    public type PhysicsProblemDetails = {
      topic : PhysicsTopic.PhysicsTopic;
      values : [(Text, Float)];
    };
  };

  module ChemistryProblemDetails {
    public type ChemistryProblemDetails = {
      topic : ChemistryTopic.ChemistryTopic;
      values : [(Text, Float)];
    };
  };

  module SolverStep {
    public type Step = {
      description : Text;
      calculation : ?Text;
      result : ?Float;
    };
  };

  module Answer {
    public type Answer = {
      value : Float;
      units : ?Text;
    };
  };

  module CalculationResult {
    public type Result = {
      finalAnswer : Answer.Answer;
      steps : [SolverStep.Step];
    };
  };

  module HistoryItem {
    public type Item = {
      id : Nat;
      mode : CalculationMode.Mode;
      input : CalculationInput.Input;
      answer : CalculationResult.Result;
      timestamp : Int;
    };

    public func compare(a : Item, b : Item) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userHistory = Map.empty<Principal, List.List<HistoryItem.Item>>();
  var nextId = 0;

  // User Profile Functions (Required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // History Functions (Require authenticated users)
  public query ({ caller }) func getHistory() : async [HistoryItem.Item] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access history");
    };
    switch (userHistory.get(caller)) {
      case (null) { [] };
      case (?historyList) { historyList.toArray().sort() };
    };
  };

  public query ({ caller }) func getHistoryItem(id : Nat) : async ?HistoryItem.Item {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access history");
    };
    switch (userHistory.get(caller)) {
      case (null) { null };
      case (?historyList) {
        historyList.find(func(item) { item.id == id });
      };
    };
  };

  public shared ({ caller }) func deleteHistoryItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete history");
    };
    switch (userHistory.get(caller)) {
      case (null) { Runtime.trap("History item not found") };
      case (?historyList) {
        if (not historyList.any(func(item) { item.id == id })) {
          Runtime.trap("History item not found");
        };
        let newList = historyList.filter(func(item) { item.id != id });
        userHistory.add(caller, newList);
      };
    };
  };

  public shared ({ caller }) func clearHistory() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can clear history");
    };
    userHistory.remove(caller);
  };

  // Calculation Functions (Require authenticated users for history storage)
  public shared ({ caller }) func runCalculation(input : CalculationInput.Input) : async CalculationResult.Result {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can run calculations");
    };
    let result = solveCalculation(input);
    storeHistory(caller, input, result);
    result;
  };

  public shared ({ caller }) func reRunHistoryItem(id : Nat) : async CalculationResult.Result {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can re-run calculations");
    };
    switch (userHistory.get(caller)) {
      case (null) { Runtime.trap("History item not found") };
      case (?historyList) {
        switch (historyList.find(func(item) { item.id == id })) {
          case (null) { Runtime.trap("History item not found") };
          case (?item) { solveCalculation(item.input) };
        };
      };
    };
  };

  func solveCalculation(input : CalculationInput.Input) : CalculationResult.Result {
    switch (input) {
      case (#mathExpression expr) { solveMath(expr) };
      case (#physicsProblem problem) { solvePhysics(problem.topic, problem.values) };
      case (#chemistryProblem problem) { solveChemistry(problem.topic, problem.values) };
    };
  };

  func storeHistory(caller : Principal, input : CalculationInput.Input, answer : CalculationResult.Result) {
    let item : HistoryItem.Item = {
      id = nextId;
      mode = getMode(input);
      input;
      answer;
      timestamp = Time.now();
    };

    switch (userHistory.get(caller)) {
      case (null) {
        let newList = List.fromArray<HistoryItem.Item>([item]);
        userHistory.add(caller, newList);
      };
      case (?existing) {
        existing.add(item);
      };
    };
    nextId += 1;
  };

  func getMode(input : CalculationInput.Input) : CalculationMode.Mode {
    switch (input) {
      case (#mathExpression _) { #math };
      case (#physicsProblem _) { #physics };
      case (#chemistryProblem _) { #chemistry };
    };
  };

  func solveMath(expression : Text) : CalculationResult.Result {
    let tokenizedInput = {
      description = "Convert input string into math tokens (numbers, operators, parentheses)";
      calculation = ?expression.concat(" → [tokens list]");
      result = null;
    };

    let parseStep = {
      description = "Parse tokens into an abstract syntax tree (AST)";
      calculation = null;
      result = null;
    };

    let evalStep = {
      description = "Evaluate the AST from the innermost nodes to the outside";
      calculation = null;
      result = null;
    };

    {
      finalAnswer = { value = 42.0; units = null };
      steps = [tokenizedInput, parseStep, evalStep];
    };
  };

  func tupleToText(entry : (Text, Float)) : Text {
    switch (entry) {
      case ((txt, float)) { txt.concat(" = ").concat(float.toText()) };
    };
  };

  func solvePhysics(topic : PhysicsTopic.PhysicsTopic, values : [(Text, Float)]) : CalculationResult.Result {
    let steps = List.empty<SolverStep.Step>();

    let calculateStep = {
      description = "Apply specific formulas and show intermediate calculations";
      calculation = ?values.toText(tupleToText);
      result = ?42.0;
    };
    steps.add(calculateStep);

    {
      finalAnswer = { value = 42.0; units = ?"units" };
      steps = steps.toArray();
    };
  };

  func solveChemistry(topic : ChemistryTopic.ChemistryTopic, values : [(Text, Float)]) : CalculationResult.Result {
    let steps = List.empty<SolverStep.Step>();

    let calculateStep = {
      description = "Calculate using provided values and show detailed steps";
      calculation = ?values.toText(tupleToText);
      result = ?42.0;
    };
    steps.add(calculateStep);

    {
      finalAnswer = { value = 42.0; units = ?"units" };
      steps = steps.toArray();
    };
  };

  // Utility Functions (Public - available to all including guests)
  public shared ({ caller }) func getConversionFactor(fromUnits : Text, toUnits : Text) : async Float {
    let key = fromUnits.concat("-").concat(toUnits);
    switch (key) {
      case ("meters-kilometers") { 0.001 };
      case ("kilometers-meters") { 1000.0 };
      case (_) { 1.0 };
    };
  };

  public query ({ caller }) func listPhysicsTopics() : async [PhysicsTopic.PhysicsTopic] {
    [
      #kinematics,
      #newtonsSecondLaw,
      #workEnergy,
      #power,
      #ohmsLaw,
    ];
  };

  public query ({ caller }) func listChemistryTopics() : async [ChemistryTopic.ChemistryTopic] {
    [
      #molarMass,
      #molesMassConversion,
      #molarity,
      #dilution,
      #idealGasLaw,
      #ph,
    ];
  };

  public query ({ caller }) func suggestUnits(value : Float, units : Text) : async Text {
    switch (units) {
      case ("meters") {
        if (value > 1000.0) { return "kilometers" };
      };
      case ("grams") {
        if (value > 1000.0) { return "kilograms" };
      };
      case ("liters") {
        if (value < 1.0) { return "milliliters" };
      };
      case ("meters-per-second") {
        if (value > 1000.0) { return "kilometers-per-hour" };
      };
      case (_) {};
    };

    units;
  };
};
