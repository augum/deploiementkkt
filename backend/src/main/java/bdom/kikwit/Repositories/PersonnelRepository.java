package bdom.kikwit.Repositories;

import bdom.kikwit.Entities.Personnel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonnelRepository extends JpaRepository<Personnel,Long> {
}
