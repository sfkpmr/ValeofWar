package game;

public class TerrainType {

	private int maxBuildingSlots;
	private int maxLumberSlots;
	private int maxIronMineSlots;
	private int maxGoldMineSlots;
	private int maxFarmSlots;
	private int maxQuarrySlots;
	private int maxWallSlots;
	private int maxTowerSlots;

	private int freeBuildingSlots;
	private int freeLumberSlots;
	private int freeIronMineSlots;
	private int freeGoldMineSlots;
	private int freeFarmSlots;
	private int freeQuarrySlots;
	private int freeWallSlots;
	private int freeTowerSlots;

	public TerrainType(int maxBuildingSlots, int maxLumberSlots, int maxIronMineSlots, int maxFarmSlots,
			int maxQuarrySlots, int maxGoldMineSlots, int maxWallSlots, int maxTowerSlots, int freeBuildingSlots, int freeLumberSlots,
			int freeIronMineSlots, int freeGoldMineSlots, int freeFarmSlots, int freeQuarrySlots, int freeWallSlots, int freeTowerSlots) {

		this.maxBuildingSlots = 1;
		this.maxLumberSlots = 1;
		this.maxIronMineSlots = 1;
		this.maxGoldMineSlots = 1;
		this.maxFarmSlots = 1;
		this.maxQuarrySlots = 1;
		this.maxWallSlots = 1;
		this.maxTowerSlots = 1;


	}

	public int getMaxBuildingSlots() {
		return maxBuildingSlots;
	}

	public void setMaxBuildingSlots(int maxBuildingSlots) {
		this.maxBuildingSlots = maxBuildingSlots;
	}

	public int getMaxLumberSlots() {
		return maxLumberSlots;
	}

	public void setMaxLumberSlots(int maxLumberSlots) {
		this.maxLumberSlots = maxLumberSlots;
	}

	public int getMaxIronMineSlots() {
		return maxIronMineSlots;
	}

	public void setMaxIronMineSlots(int maxIronMineSlots) {
		this.maxIronMineSlots = maxIronMineSlots;
	}

	public int getMaxGoldMineSlots() {
		return maxGoldMineSlots;
	}

	public void setMaxGoldMineSlots(int maxGoldMineSlots) {
		this.maxGoldMineSlots = maxGoldMineSlots;
	}

	public int getMaxFarmSlots() {
		return maxFarmSlots;
	}

	public void setMaxFarmSlots(int maxFarmSlots) {
		this.maxFarmSlots = maxFarmSlots;
	}

	public int getMaxQuarrySlots() {
		return maxQuarrySlots;
	}

	public void setMaxQuarrySlots(int maxQuarrySlots) {
		this.maxQuarrySlots = maxQuarrySlots;
	}

	public int getMaxWallSlots() {
		return maxWallSlots;
	}

	public void setMaxWallSlots(int maxWallSlots) {
		this.maxWallSlots = maxWallSlots;
	}

	public int getMaxTowerSlots() {
		return maxTowerSlots;
	}

	public void setMaxTowerSlots(int maxTowerSlots) {
		this.maxTowerSlots = maxTowerSlots;
	}

	public int getFreeBuildingSlots() {
		return freeBuildingSlots;
	}

	public void setFreeBuildingSlots(int freeBuildingSlots) {
		this.freeBuildingSlots = freeBuildingSlots;
	}

	public int getFreeLumberSlots() {
		return freeLumberSlots;
	}

	public void setFreeLumberSlots(int freeLumberSlots) {
		this.freeLumberSlots = freeLumberSlots;
	}

	public int getFreeIronMineSlots() {
		return freeIronMineSlots;
	}

	public void setFreeIronMineSlots(int freeIronMineSlots) {
		this.freeIronMineSlots = freeIronMineSlots;
	}

	public int getFreeGoldMineSlots() {
		return freeGoldMineSlots;
	}

	public void setFreeGoldMineSlots(int freeGoldMineSlots) {
		this.freeGoldMineSlots = freeGoldMineSlots;
	}

	public int getFreeFarmSlots() {
		return freeFarmSlots;
	}

	public void setFreeFarmSlots(int freeFarmSlots) {
		this.freeFarmSlots = freeFarmSlots;
	}

	public int getFreeQuarrySlots() {
		return freeQuarrySlots;
	}

	public void setFreeQuarrySlots(int freeQuarrySlots) {
		this.freeQuarrySlots = freeQuarrySlots;
	}

	public int getFreeWallSlots() {
		return freeWallSlots;
	}

	public void setFreeWallSlots(int freeWallSlots) {
		this.freeWallSlots = freeWallSlots;
	}

	public int getFreeTowerSlots() {
		return freeTowerSlots;
	}

	public void setFreeTowerSlots(int freeTowerSlots) {
		this.freeTowerSlots = freeTowerSlots;
	}

}
