package buildings;

public class Warehouse extends Building {

	private int ironCapacity;
	private int grainCapacity;
	private int stoneCapacity;
	private int lumberCapacity;

	public Warehouse() {
		super();
		super.maxQuantity = 5;
		// TODO Auto-generated constructor stub
		this.stoneCapacity = 20000;
		this.grainCapacity = 20000;
		this.lumberCapacity = 20000;
		this.ironCapacity = 20000;
	}

	public int getIronCapacity() {
		return ironCapacity;
	}

	public void setIronCapacity(int ironCapacity) {
		this.ironCapacity = ironCapacity;
	}

	public int getGrainCapacity() {
		return grainCapacity;
	}

	public void setGrainCapacity(int grainCapacity) {
		this.grainCapacity = grainCapacity;
	}

	public int getStoneCapacity() {
		return stoneCapacity;
	}

	public void setStoneCapacity(int stoneCapacity) {
		this.stoneCapacity = stoneCapacity;
	}

	public int getLumberCapacity() {
		return lumberCapacity;
	}

	public void setLumberCapacity(int lumberCapacity) {
		this.lumberCapacity = lumberCapacity;
	}

	
	
}
