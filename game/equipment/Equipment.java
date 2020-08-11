package equipment;

public class Equipment {

	int attackDamageBonus;
	int defenseDamageBonus;
	
	public Equipment(int attackDamageBonus, int defenseDamageBonus) {
		
		this.attackDamageBonus = attackDamageBonus;
		this.defenseDamageBonus = defenseDamageBonus;
	}

	public int getAttackDamageBonus() {
		return attackDamageBonus;
	}

	public void setAttackDamageBonus(int attackDamageBonus) {
		this.attackDamageBonus = attackDamageBonus;
	}

	public int getDefenseDamageBonus() {
		return defenseDamageBonus;
	}

	public void setDefenseDamageBonus(int defenseDamageBonus) {
		this.defenseDamageBonus = defenseDamageBonus;
	}
	
    

}
