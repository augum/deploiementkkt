package bdom.kikwit.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Entity @ToString
public class Categorie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   private String libelle;

}
