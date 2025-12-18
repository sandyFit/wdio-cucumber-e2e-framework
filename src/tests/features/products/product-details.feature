Feature: Product Details
    
    Scenario: View Product Details 
        Given the user is on the Home page
        When the user clicks on a specific product name or image
        Then the system should open the Product Details page
        And displays all the product's information (price, description, environmental impact, category)
