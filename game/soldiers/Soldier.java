package soldiers;

public class Soldier {

	protected String name;
	protected int attackDamage;
	protected int defenseDamage;
	protected int loadCapacity;
	protected String description;
	protected int lumberCost;
	protected int ironCost;
	protected int grainCost;
	protected int goldCost;
	protected String namePlural;

	public Soldier() {
		this.name = "Missing soldier name.";
		this.namePlural = "Missing soldier plural name.";
		this.attackDamage = -1;
		this.defenseDamage = -1;
		this.loadCapacity = -1;
		this.description = "Missing soldier description.";
		this.goldCost = 0;
		this.grainCost = 0;
		this.ironCost = 0;
		this.lumberCost = 0;
	}

	public String getName() {
		return name;
	}

	public int getAttackDamage() {
		return attackDamage;
	}

	public int getDefenseDamage() {
		return defenseDamage;
	}

	public int getLoadCapacity() {
		return loadCapacity;
	}

	public String getDescription() {
		return description;
	}

	public int getLumberCost() {
		return lumberCost;
	}

	public int getIronCost() {
		return ironCost;
	}

	public int getGrainCost() {
		return grainCost;
	}

	public int getGoldCost() {
		return goldCost;
	}

	public String getNamePlural() {
		return namePlural;
	}

}