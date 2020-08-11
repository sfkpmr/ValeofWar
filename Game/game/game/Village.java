package game;

import java.awt.Point;
import java.util.HashMap;
import java.util.Map.Entry;

import buildings.*;
import resources.*;
import soldiers.Soldier;

public class Village {

	private int id;
	private String villageName;
	private Point coordinates;

	private double gold;
	private double stone;
	private double lumber;
	private double iron;
	private double grain;
	private int recruits;
	private HashMap<Integer, Soldier> army;
	private HashMap<String, Building> buildingList;
	private HashMap<Integer, Resource> resourceList;

	private int recruitsIncome;
	private double goldIncome;
	private double stoneIncome;
	private double lumberIncome;
	private double ironIncome;
	private double grainIncome;

	private String terrain;

	private int maxNumberGoldMines;
	private int maxNumberLumberCamps;
	private int maxNumberQuarries;
	private int maxNumberIronMines;
	private int maxNumberGrainFields;
	private int ironCapacity;
	private int grainCapacity;
	private int lumberCapacity;
	private int stoneCapacity;
	private int goldCapacity;
	private HashMap<Integer, Warehouse> warehouseList;

	// TODO separate list for buildings that there can be multiple of

	public Village(String villageName) { // TODO map terrain
		this.id = 2;
		this.villageName = villageName;
		this.coordinates = new Point(0, 0);
		HashMap<Integer, Soldier> army = new HashMap<>();
		this.army = army;
		HashMap<String, Building> buildingList = new HashMap<>();
		this.buildingList = buildingList;
		HashMap<Integer, Resource> resourceList = new HashMap<>();
		this.resourceList = resourceList;
		HashMap<Integer, Warehouse> warehouseList = new HashMap<>();
		this.warehouseList = warehouseList;

		resourceList.put(0, new Gold());
		resourceList.put(1, new Grain());
		resourceList.put(2, new Iron());
		resourceList.put(3, new Lumber());
		resourceList.put(4, new Stone());

		this.gold = 500;
		this.stone = 500;
		this.lumber = 500;
		this.iron = 500;
		this.grain = 500;
		this.recruits = 50;
		// TODO horse production?

		this.terrain = "Mixed";

		this.maxNumberGoldMines = 1;
		this.maxNumberLumberCamps = 4;
		this.maxNumberQuarries = 2;
		this.maxNumberIronMines = 1;
		this.maxNumberGrainFields = 5;

		this.goldCapacity = 0;
		this.stoneCapacity = 0;
		this.lumberCapacity = 0;
		this.ironCapacity = 0;
		this.grainCapacity = 0;

	}

	public int getID() {
		return this.id;
	}

	public String getName() {
		return this.villageName;
	}

	public Point getCoordinates() {
		return this.coordinates;
	}

	public double getGold() {
		return gold;
	}

	public void addGold(double d) {
		this.gold += d;
	}

	public void payGold(int i) {
		this.gold -= i;
	}

	public double getStone() {
		return stone;
	}

	public void addStone(double d) {
		this.stone += d;
	}

	public void payStone(int i) {
		this.stone -= i;
	}

	public double getLumber() {
		return lumber;
	}

	public void addLumber(double d) {
		this.lumber += d;
	}

	public void payLumber(int i) {
		this.lumber -= i;
	}

	public double getIron() {
		return iron;
	}

	public void addIron(double d) {
		this.iron += d;
	}

	public void payIron(int i) {
		this.iron -= i;
	}

	public double getGrain() {
		return grain;
	}

	public void addGrain(double d) {
		this.grain += d;
	}

	public void payGrain(int i) {
		this.grain -= i;
	}

	public HashMap<Integer, Soldier> getArmy() {
		return army;
	}

	public HashMap<String, Building> getBuildings() {
		return buildingList;
	}

	// TODO remove
	public Barracks getBarracks() {
		return (Barracks) buildingList.get("Barracks");
	}

	// TODO remove
	public Furnace getFurnace() {
		return (Furnace) buildingList.get("Furnace");
	}

	public void build(String s) {

		Building b = null;

//		if (buildingList.containsKey(s)) { //TODO needs to allow having multiple warehouses, separate hashmap?
//			System.out.println("ERROR: this village already has a " + s);
//		}

		if (s.equals("Barracks")) {
			if (!buildingList.containsKey("Barracks")) {
				b = new Barracks();
			}
		} else if (s.equals("Furnace")) {
			if (!buildingList.containsKey("Furnace")) {
				b = new Furnace();
			}
		} else if (s.equals("Sawmill")) {
			if (!buildingList.containsKey("Sawmill")) {
				b = new Sawmill();
			}
		} else if (s.equals("Market")) {
			if (!buildingList.containsKey("Market")) {
				b = new Market();
			}
		} else if (s.equals("Warehouse")) {
			if (!buildingList.containsKey("Warehouse")) {
				b = new Market();
			}
		}

		buildingList.put(s, b);
	}

	@Override
	public String toString() {
		return "Village [id=" + id + ", name=" + villageName + ", coordinates=" + coordinates + ", gold=" + gold
				+ ", stone=" + stone + ", lumber=" + lumber + ", iron=" + iron + ", grain=" + grain + ", army=" + army
				+ ", buildingsList=" + buildingList + "]";
	}

	public int getRecruits() {
		return recruits;
	}

	public void addRecruits(int i) {
		this.recruits += i;
	}

	public void payRecruits(int i) {
		this.recruits -= i;
	}

	public HashMap<Integer, Resource> getResourceList() {
		return resourceList;
	}

	public void calculateGoldIncome() {
		double production = 0;

		for (int i = 0; i < resourceList.size(); i++) {

			Resource r = resourceList.get(i);

			if (r.getName().equalsIgnoreCase("gold")) {
				production += r.getProduction();
			}
		}

		goldIncome = production * getFurnace().productionMultiplier();

	}

	public int getRecruitsIncome() {
		return recruitsIncome;
	}

	public void setRecruitsIncome(int recruitsIncome) {
		this.recruitsIncome = recruitsIncome;
	}

	public double getGoldIncome() {
		return goldIncome;
	}

	public void setGoldIncome(double goldIncome) {
		this.goldIncome = goldIncome;
	}

	public double getStoneIncome() {
		return stoneIncome;
	}

	public void setStoneIncome(double stoneIncome) {
		this.stoneIncome = stoneIncome;
	}

	public double getLumberIncome() {
		return lumberIncome;
	}

	public void setLumberIncome(double lumberIncome) {
		this.lumberIncome = lumberIncome;
	}

	public double getIronIncome() {
		return ironIncome;
	}

	public void setIronIncome(double ironIncome) {
		this.ironIncome = ironIncome;
	}

	public double getGrainIncome() {
		return grainIncome;
	}

	public void setGrainIncome(double grainIncome) {
		this.grainIncome = grainIncome;
	}

	public void addResources() {

		addGold(getGoldIncome() / 3600);
		addStone(getStoneIncome() / 3600);
		addGrain(getGrainIncome() / 3600);
		addLumber(getLumberIncome() / 3600);
		addIron(getIronIncome() / 3600);
		addRecruits(getRecruitsIncome() / 3600);

	}

	public void attack(Village v, Player p) {

		if (this.getArmyAttackValue(p) > v.getArmyDefenseValue(p)) {
			System.out.println("Victory!");
		} else {
			System.out.println("Defeat!");
		}

	}

	public double getArmyAttackValue(Player p) {

		double counter = 0;

		for (int i = 0; i < army.size(); i++) {

			counter += army.get(i).getAttackDamage();

		}

		if (p.getLeader() != null) {
			return counter * p.getLeader().getAttackModifierLevel();
		} else {
			return counter;
		}

	}

	public double getArmyDefenseValue(Player p) {

		double counter = 0;

		for (int i = 0; i < army.size(); i++) {

			counter += army.get(i).getDefenseDamage();

		}

		if (p.getLeader() != null) {

			return counter * p.getLeader().getDefenseModifierLevel();
		} else {
			return counter;
		}

	}

	public void setGold(double gold) {
		this.gold = gold;
	}

	public void setStone(double stone) {
		this.stone = stone;
	}

	public void setLumber(double lumber) {
		this.lumber = lumber;
	}

	public void setIron(double iron) {
		this.iron = iron;
	}

	public void setGrain(double grain) {
		this.grain = grain;
	}

	public Building getBuilding(String name) {

		return getBuildings().get(name);

	}

	public Building getWarehouse(int i) {

		return getWarehouseList().get(i);

	}

	public void removeAllResources() {
		setGold(0);
		setGrain(0);
		setIron(0);
		setLumber(0);
		setStone(0);
	}

	public void calculateStorage() {

		int totalIron = 0;
		int totalGrain = 0;
		int totalLumber = 0;
		int totalStone = 0;

		for (Entry<Integer, Warehouse> entry : this.getWarehouseList().entrySet()) {

			totalLumber += entry.getValue().getLumberCapacity();
			totalStone += entry.getValue().getStoneCapacity();
			totalGrain += entry.getValue().getGrainCapacity();
			totalIron += entry.getValue().getIronCapacity();

		}

	}

	public HashMap<Integer, Warehouse> getWarehouseList() {
		return warehouseList;
	}

}