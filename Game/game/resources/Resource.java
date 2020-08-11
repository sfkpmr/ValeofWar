package resources;

public class Resource {

	protected int level;
	private int maxLevel;
	protected String name;
	protected int maxQuantity;
	protected String description;

	public Resource() {
		this.level = 1;
		this.maxLevel = 10;
		this.name = "Resource name missing";
		this.maxQuantity = 5;
		this.description = "Missing resource description";
	}

	public int getLevel() {
		return level;
	}

	public void upgrade(int level) {
		this.level = level;
	}

	public int getMaxLevel() {
		return maxLevel;
	}

	public String getName() {
		return name;
	}

	public int getProduction() {
		return -1;
	}

}
