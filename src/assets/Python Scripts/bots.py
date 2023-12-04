def calculate_gains(bot_price, initial_bots, daily_profit, total_days):
    num_bots = initial_bots
    total_profit = 0

    for day in range(total_days):
        # Calculate today's profit
        today_profit = num_bots * daily_profit
        total_profit += today_profit

        # Add a new bot from outside pool every 14 days
        if (day + 1) % 7 == 0:
            num_bots += 1
            print(
                f"Day {day + 1}: Added a new bot from outside pool. Total bots: {num_bots}"
            )

        # Check if we can buy a new bot from profits
        while total_profit >= bot_price:
            num_bots += 1
            total_profit -= bot_price
            print(
                f"Day {day + 1}: Bought a new bot from profits. Total bots: {num_bots}"
            )

        print(
            f"Day {day + 1}: Total profit = ${total_profit:.2f}, Total bots = {num_bots}"
        )

    return total_profit, num_bots


# Initial parameters
bot_price = 272  # in USD
initial_bots = 7
daily_profit_per_bot = 2.5  # in USD
total_days = 182  # You can change this to simulate for different durations

# Calculate gains
final_profit, final_bots = calculate_gains(
    bot_price, initial_bots, daily_profit_per_bot, total_days
)
print(
    f"After {total_days} days, total profit is ${final_profit:.2f} with {final_bots} bots - bots worth - {bot_price * final_bots}."
)
