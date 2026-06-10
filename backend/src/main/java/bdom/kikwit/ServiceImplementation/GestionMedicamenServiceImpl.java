package bdom.kikwit.ServiceImplementation;

import bdom.kikwit.Dto.GestionMedicamentRequestDto;
import bdom.kikwit.Dto.GestionMedicamentResponseDto;
import bdom.kikwit.Entities.CartographieStructure;
import bdom.kikwit.Entities.Etablissement;
import bdom.kikwit.Entities.GestionMedicament;
import bdom.kikwit.Mappers.GestionMedMapper;
import bdom.kikwit.Repositories.EtablissementRepository;
import bdom.kikwit.Repositories.GestionMedicamentRepository;
import bdom.kikwit.Services.GestionMedicamenService;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service @AllArgsConstructor @Transactional
public class GestionMedicamenServiceImpl implements GestionMedicamenService {
    private GestionMedicamentRepository repository;
    private GestionMedMapper mapper;
    private EtablissementRepository etablissementRepository;
    /*
    * Enregistrer la gestion de medicament
    * */
    @Override
    public GestionMedicamentResponseDto save(GestionMedicamentRequestDto requestDto) {
        GestionMedicament medicament = mapper.fromGestionMedicamentRequestDto(requestDto);
        GestionMedicament save = repository.save(medicament);
        return mapper.toGestionMedicamentResponseDto(save);
    }

    @Override
    public GestionMedicamentResponseDto update(Long id, GestionMedicamentRequestDto requestDto) {
        GestionMedicament medicament = mapper.fromGestionMedicamentRequestDto(requestDto);
        GestionMedicament getMedicament = repository.findById(id).get();
        getMedicament.setBenefice(medicament.getBenefice());
        getMedicament.setPeriode(medicament.getPeriode());
        getMedicament.setCroissance(medicament.getCroissance());
        getMedicament.setCapital_depart(medicament.getCapital_depart());
        getMedicament.setCapital_fin_moi(medicament.getCapital_fin_moi());
        getMedicament.setId_ess(medicament.getId_ess());
        GestionMedicament save = repository.save(getMedicament);
        return mapper.toGestionMedicamentResponseDto(save);
    }
/*
* Recuperation d'une gestion de medicament
* */
    @Override
    public GestionMedicamentResponseDto getOne(Long id) {
        GestionMedicament medicament = repository.findById(id).get();
        return mapper.toGestionMedicamentResponseDto(medicament);
    }

    @Override
    public String delete(Long id) {
        Optional<GestionMedicament> gestionMedicament = repository.findById(id);
        if (gestionMedicament.isPresent()){
            repository.deleteById(id);
            return " Gestion medicament supprimée avec succes";
        }
        return "Aucune Gestion medicament trouvée";
    }

    /*
 * Liste des gestions medicaments
 * */
    @Override
    public List<GestionMedicamentResponseDto> getAll() {
        List<GestionMedicament> list = repository.findAll();
        for(GestionMedicament gm: list){
            Etablissement etablissement = etablissementRepository.findById(gm.getId_ess()).get();
            gm.setEtablissement(etablissement);
        }
        return list.stream()
                .map(gestionMedicament -> mapper.toGestionMedicamentResponseDto(gestionMedicament))
                .collect(Collectors.toList());
    }
}
