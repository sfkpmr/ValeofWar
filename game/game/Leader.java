package game;

public class Leader {

	private String name;
	private double attackModifierLevel;
	private double defenseModifierLevel;
	private int level;
	private int experience;

	public Leader(String name) {
		this.name = name;
		this.level = 0;
		this.experience = 0;
		this.attackModifierLevel = 0;
		this.defenseModifierLevel = 0;

		// loot more
		// carry moreNe
	}

	public String getName() {
		return name;
	}

	public double getAttackModifierLevel() {
		return attackModifierLevel;
	}

	public void setAttackModifierLevel(double d) {
		this.attackModifierLevel = d;
	}

	public double getDefenseModifierLevel() {
		return defenseModifierLevel;
	}

	public void setDefenseModifierLevel(int defenseModifier) {
		this.defenseModifierLevel = defenseModifier;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public int getExperience() {
		return experience;
	}

	public void setExperience(int experience) {
		this.experience = experience;
	}

}
