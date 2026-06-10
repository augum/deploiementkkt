package bdom.kikwit.Entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;


@Entity
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class GestionMedicament {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long id_ess;
    private LocalDate periode;
    private double capital_depart;
    private double capital_fin_moi;
    private String croissance;
    private String benefice;
    @Transient
    private Etablissement etablissement;
}
