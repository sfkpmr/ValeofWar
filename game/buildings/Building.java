package buildings;

import game.Village;

public class Building {

	protected int level;
	protected int maxLevel;
	protected String name;
	protected String description;
	protected int upgradeCostGold;
	protected int upgradeCostLumber;
	protected int upgradeCostStone;
	protected int upgradeCostIron;
	protected int maxQuantity;
	private int villageBuildingTileID;

	public Building() {

		this.level = 1;
		this.maxLevel = 10;
		this.name = "Building name missing";
		this.description = "Building description missing";
		this.upgradeCostGold = -1;
		this.upgradeCostLumber = -1;
		this.upgradeCostStone = -1;
		this.upgradeCostIron = -1;
		this.maxQuantity = 1;
		this.villageBuildingTileID = 0;

	}

	public int getLevel() {
		return this.level;
	}

	public void upgrade(Village v) {

		
		
		if (v.getGold() >= this.upgradeCostGold && v.getStone() >= this.upgradeCostStone
				&& v.getIron() >= this.upgradeCostIron && v.getLumber() >= upgradeCostLumber) {
			this.level++;
		} else {
			System.out.println("You can't afford to upgrade this building!");
		}

	}

	public int getMaxLevel() {
		return maxLevel;
	}

	public String getDescription() {
		return description;
	}

	public String getName() {
		return name;
	}

	@Override
	public String toString() {
		return "The " + name + " is level " + level + " and used for " + description + ". Maximum level is " + maxLevel
				+ ".";
	}

	//TODO flytta
	public double productionMultiplier() {

		double modifier = 0;

		if (this.level == 1) {
			modifier = 1.1;
		} else if (this.level == 2) {
			modifier = 1.2;
		} else if (this.level == 3) {
			modifier = 1.3;
		}
		return modifier;

	}

	public int getVillageBuildingTileID() {
		return villageBuildingTileID;
	}

}
