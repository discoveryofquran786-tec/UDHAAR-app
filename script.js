#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <sstream>
#include <ctime>
#include <algorithm>

/*
    PROFESSIONAL KHATA BACKEND
    --------------------------
    - Persistent storage (file-based)
    - Business logic separated cleanly
    - Inspired by your JavaScript app logic
*/

// =======================
// DATA MODEL
// =======================
struct Transaction {
    long long id;
    std::string name;
    int amount;
    std::string time;
};

// =======================
// DATABASE LAYER
// =======================
class Database {
public:
    static std::vector<Transaction> load() {
        std::vector<Transaction> data;
        std::ifstream file("khata.db");

        std::string line;
        while (getline(file, line)) {
            std::stringstream ss(line);
            Transaction t;
            std::string temp;

            getline(ss, temp, '|');
            t.id = std::stoll(temp);

            getline(ss, t.name, '|');

            getline(ss, temp, '|');
            t.amount = std::stoi(temp);

            getline(ss, t.time);

            data.push_back(t);
        }
        return data;
    }

    static void save(const std::vector<Transaction>& data) {
        std::ofstream file("khata.db", std::ios::trunc);
        for (const auto& t : data) {
            file << t.id << "|"
                 << t.name << "|"
                 << t.amount << "|"
                 << t.time << "\n";
        }
    }
};

// =======================
// BUSINESS LOGIC (SERVICE)
// =======================
class KhataService {
private:
    std::vector<Transaction> khata;

    std::string currentTime() {
        char buffer[6];
        std::time_t now = std::time(nullptr);
        std::tm* ltm = std::localtime(&now);
        std::strftime(buffer, 6, "%H:%M", ltm);
        return buffer;
    }

public:
    KhataService() {
        khata = Database::load();
    }

    void addTransaction(const std::string& name, int amount) {
        Transaction t;
        t.id = static_cast<long long>(std::time(nullptr)) * 1000;
        t.name = name;
        t.amount = amount;
        t.time = currentTime();

        khata.push_back(t);
        Database::save(khata);
    }

    void deleteTransaction(long long id) {
        khata.erase(
            std::remove_if(khata.begin(), khata.end(),
                [&](const Transaction& t) {
                    return t.id == id;
                }),
            khata.end()
        );
        Database::save(khata);
    }

    void clearAll() {
        khata.clear();
        Database::save(khata);
    }

    int totalAmount() const {
        int total = 0;
        for (const auto& t : khata) {
            total += t.amount;
        }
        return total;
    }

    const std::vector<Transaction>& getAll() const {
        return khata;
    }
};

// =======================
// API / INTERFACE (CLI)
// =======================
int main() {
    KhataService service;
    int choice;

    std::cout << "=== KHATA BACKEND SYSTEM ===\n";

    while (true) {
        std::cout <<
            "\n1. Add Transaction"
            "\n2. View All"
            "\n3. Delete Transaction"
            "\n4. Total Amount"
            "\n5. Clear All"
            "\n0. Exit\n\nChoice: ";

        std::cin >> choice;

        if (choice == 0) break;

        if (choice == 1) {
            std::string name;
            int amount;
            std::cout << "Name: ";
            std::cin >> name;
            std::cout << "Amount: ";
            std::cin >> amount;
            service.addTransaction(name, amount);
            std::cout << "Transaction added.\n";
        }

        else if (choice == 2) {
            const auto& list = service.getAll();
            if (list.empty()) {
                std::cout << "No records found.\n";
            } else {
                for (const auto& t : list) {
                    std::cout
                        << "ID: " << t.id
                        << " | Name: " << t.name
                        << " | ₹" << t.amount
                        << " | Time: " << t.time << "\n";
                }
            }
        }

        else if (choice == 3) {
            long long id;
            std::cout << "Enter ID to delete: ";
            std::cin >> id;
            service.deleteTransaction(id);
            std::cout << "Deleted if ID existed.\n";
        }

        else if (choice == 4) {
            std::cout << "Total Amount: ₹" << service.totalAmount() << "\n";
        }

        else if (choice == 5) {
            service.clearAll();
            std::cout << "All records cleared.\n";
        }

        else {
            std::cout << "Invalid choice.\n";
        }
    }

    std::cout << "Goodbye.\n";
    return 0;
}