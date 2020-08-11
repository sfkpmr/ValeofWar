package soldiers;

public class Archer extends Soldier {

	public Archer() {
		// super();
		super.name = "Archer";
		super.namePlural = "Archers";
		super.attackDamage = 50;
		super.defenseDamage = 100;
		super.loadCapacity = 10;
		super.description = "Archers are excellent ranged soldiers.";
		super.grainCost = 10;
		super.goldCost = 10;

	}

	@Override
	public String toString() {
		return "Archer [getName()=" + getName() + ", getAttackDamage()=" + getAttackDamage() + ", getDefenseDamage()="
				+ getDefenseDamage() + ", getLoadCapacity()=" + getLoadCapacity() + ", getDescription()="
				+ getDescription() + ", getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()="
				+ super.toString() + "]";
	}

}
